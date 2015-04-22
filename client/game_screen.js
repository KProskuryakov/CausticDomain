/**
 * Created by Kostya on 4/20/2015.
 */
var GameScreen = function(socket, ctx, name, classSelected, players, data) {
    var Classes = {};
    Classes.Warrior = require("./../classes/warrior");
    Classes.Priest = require("./../classes/priest");
    Classes.Rogue = require("./../classes/rogue");
    Classes.Mage = require("./../classes/mage");

    var canvas = document.getElementById("myCanvas");

    var dt = 0;
    var lastUpdate = Date.now();
    var keys = [];

    var moveSpeed = 100;
    var diagMoveSpeed = moveSpeed * .71;

    var myCharacter = {
        x: data.x, y: 0, r: 10, velX: 0, velY: 0,
        curDirection: "none", newDirection: "none",
        combatState: "normal", directionAfterCast: "none"
    };
    var lmbSkill = new Classes[classSelected].skillTrackers[0]();
    var aliveSkills = [];

    socket.emit('moveChange', getTeleportChange());

    for (var i = 0; i < players.length; i++) {
        players[i].character = {
            x: 0, y: 0, r: 10, velX: 0, velY: 0,
            ix: 0, iy: 0, ivel: 115
        };
    }

    this.update = function() {
        dt = (Date.now() - lastUpdate) / 1000;

        updateMyPlayer();
        updateOtherPlayers();
        updateSkillTrackers();
        updateAliveSkills();

        lastUpdate = Date.now();
    };
    function updateMyPlayer() {
        if (myCharacter.combatState == "casting") {
            //myCharacter.directionAfterCast = myCharacter.newDirection;
            myCharacter.newDirection = "none";
        }
        //if (myCharacter.combatState == "revert") {
        //    myCharacter.newDirection = myCharacter.directionAfterCast;
        //    myCharacter.combatState = "normal";
        //}
        if (myCharacter.newDirection != myCharacter.curDirection) {
            switch(myCharacter.newDirection) {
                case "none":
                    myCharacter.velX = 0;
                    myCharacter.velY = 0;
                    break;
                case "north":
                    myCharacter.velX = 0;
                    myCharacter.velY = moveSpeed;
                    break;
                case "south":
                    myCharacter.velX = 0;
                    myCharacter.velY = -moveSpeed;
                    break;
                case "east":
                    myCharacter.velX = moveSpeed;
                    myCharacter.velY = 0;
                    break;
                case "west":
                    myCharacter.velX = -moveSpeed;
                    myCharacter.velY = 0;
                    break;
                case "northeast":
                    myCharacter.velX = diagMoveSpeed;
                    myCharacter.velY = diagMoveSpeed;
                    break;
                case "northwest":
                    myCharacter.velX = -diagMoveSpeed;
                    myCharacter.velY = diagMoveSpeed;
                    break;
                case "southeast":
                    myCharacter.velX = diagMoveSpeed;
                    myCharacter.velY = -diagMoveSpeed;
                    break;
                case "southwest":
                    myCharacter.velX = -diagMoveSpeed;
                    myCharacter.velY = -diagMoveSpeed;
                    break;
            }
            myCharacter.curDirection = myCharacter.newDirection;
            socket.emit('moveChange', getMoveChange());
        }
        if (myCharacter.direction != "none") {
            myCharacter.x += myCharacter.velX * dt;
            myCharacter.y += myCharacter.velY * dt;
        }
    }
    function updateOtherPlayers() {
        for (var i = 0; i < players.length; i++) {
            var char = players[i].character;
            if (char.vel != 0) {
                var xinc = char.velX * dt;
                var yinc = char.velY * dt;
                char.x += xinc; char.ix += xinc;
                char.y += yinc; char.iy += yinc;
            }
            if (Math.abs(char.ix - char.x) < 5 && Math.abs(char.iy - char.y) < 5) {
                char.ix = char.x;
                char.iy = char.y;
            } else {
                var idir = Math.atan2(char.y - char.iy, char.x - char.ix);
                char.ix += Math.cos(idir) * char.ivel * dt;
                char.iy += Math.sin(idir) * char.ivel * dt;
            }
        }
    }
    function updateSkillTrackers() {
        lmbSkill.update(dt, myCharacter);
    }
    function updateAliveSkills() {
        for (var i = 0; i < aliveSkills.length; i++) {
            aliveSkills[i].update(dt);
            if (aliveSkills[i].state == "dead") {
                aliveSkills.splice(i, 1);
                i--;
            }
        }
    }

    this.draw = function() {
        ctx.clearRect(0, 0, 800, 600);
        drawAliveSkills();
        drawOtherPlayers();
        drawSkillTrackers();
        drawPlayer();
    };
    function drawPlayer() {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(400, 300, myCharacter.r, 0, 2 * Math.PI);
        ctx.fill();
    }
    function drawOtherPlayers() {
        for (var i = 0; i < players.length; i++) {
            var other = players[i].character;
            var x = 400 + other.ix - myCharacter.x;
            var y = 300 - other.iy + myCharacter.y;
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(x, y, other.r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.font = "8px Arial";
            ctx.fillText(players[i].name, x - ctx.measureText(players[i].name).width / 2, y - 15);
        }
    }
    function drawSkillTrackers() {
        lmbSkill.draw(ctx);
    }
    function drawAliveSkills() {
        for (var i = 0; i < aliveSkills.length; i++) {
            aliveSkills[i].draw(ctx);
        }
    }

    this.checkKeys = function(e) {
        keys[e.keyCode] = e.type == 'keydown';
        if (keys[87] && keys[83] || keys[65] && keys[68] || !keys[87] && !keys[83] && !keys[65] && !keys[68]) {
            myCharacter.newDirection = "none";
        } else if (keys[87] && keys[65]) {
            myCharacter.newDirection = "northwest";
        } else if (keys[87] && keys[68]) {
            myCharacter.newDirection = "northeast";
        } else if (keys[83] && keys[65]) {
            myCharacter.newDirection = "southwest";
        } else if (keys[83] && keys[68]) {
            myCharacter.newDirection = "southeast";
        } else if (keys[87]) {
            myCharacter.newDirection = "north";
        } else if (keys[83]) {
            myCharacter.newDirection = "south";
        } else if (keys[65]) {
            myCharacter.newDirection = "west";
        } else if (keys[68]) {
            myCharacter.newDirection = "east";
        }
        return false;
    };

    this.doClick = function(e) {
        var offset = findOffset(canvas);
        var posX = e.pageX - offset.x;     //find the x position of the mouse
        var posY = e.pageY - offset.y;     //find the y position of the mouse
        lmbSkill.cast(posX, posY, myCharacter, aliveSkills);
        console.log(lmbSkill);
    };

    this.mouseMove = function(e) {};


    function moveChange(data) {
        for (var i = 0; i < players.length; i++) {
            var c = players[i].character;
            if (players[i].name == data.name) {
                c.x = data.x; c.y = data.y;
                c.velX = data.velX; c.velY = data.velY;
                if (data.teleport) {
                    c.ix = data.x;
                    c.iy = data.y;
                }
                return;
            }
        }
    }
    function getMoveChange() {
        return {name: name, x: myCharacter.x, y: myCharacter.y,
            velX: myCharacter.velX, velY: myCharacter.velY, teleport: false};
    }
    function getTeleportChange() {
        var change = getMoveChange();
        change.teleport = true;
        return change;
    }

    function bind() {
        socket.on('moveChange', moveChange);
    }

    function unbind() {
        socket.removeListener('moveChange', moveChange);
    }

    bind();
};

function findOffset(obj) {
    var curX = 0;
    var curY = 0;
    if (obj.offsetParent) {   //if the browser supports offsetParent then we can use it
        do {
            curX += obj.offsetLeft;  //get left position of the obj and add it to the var.
            curY += obj.offsetTop;   //gets top position and add it to the var.
        } while (obj = obj.offsetParent);

        return {x:curX, y:curY};  //this is a function that returns two values
    }
}

module.exports = GameScreen;