(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Kostya on 4/20/2015.
 */

},{}],2:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],3:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],4:[function(require,module,exports){
/**
 * Created by Kostya on 4/20/2015.
 */
Warrior = {
    maxHealth: 650,
    skillTrackers: [],
    skills: [],
    clientSkills: []
};

Warrior.skillTrackers[0] = function() {
    this.castTime = 1;
    this.cooldown = 1;
    this.curCooldown = 0;

    this.cast = function(x, y, char, aliveSkills) {
        if (char.combatState == "normal" && this.curCooldown <= 0) {
            char.combatState = "casting";
            aliveSkills.push(new Warrior.skills[0](x, y, Math.atan2(-300 + y, -400 + x), this.castTime, "brown", 50, Math.PI / 2));
            this.curCooldown = this.cooldown + this.castTime;
        }
    };

    this.update = function(dt, char) {
        this.curCooldown = Math.max(0, this.curCooldown - dt);
        if (this.curCooldown <= this.cooldown) {
            char.combatState = "normal";
        }
    };

    this.draw = function(ctx) {
        ctx.font = "14px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("LMB: " + parseFloat(Math.round(this.curCooldown * 100) / 100).toFixed(1), 5, 582);
    };
};
Warrior.skills[0] = function(x, y, dir, castTime, color, r, cir) {
    this.state = "casting";
    this.curCastTime = 0;

    this.update = function(dt) {
        switch(this.state) {
            case "casting":
                this.curCastTime = Math.min(castTime, this.curCastTime + dt);
                if (this.curCastTime >= castTime) {
                    //var bDir = Math.atan2(boss.y - this.y, boss.x - this.x);
                    //var bDist = Math.pow(boss.x - this.x, 2) + Math.pow(boss.y - this.y, 2) < Math.pow(this.r + boss.r, 2);
                    //var bAngle = (bDir - this.dir) % (Math.PI * 2);
                    //
                    //if (bDist && bAngle <= this.cir / 2 && bAngle >= this.cir / -2 && castByMe) {
                    //    boss.takeDamage(50, "physical");
                    //    myPlayer.myCharacter.addDamageReductionEffect(this.name, this.effect, this.effectDuration);
                    //}
                    this.state = "dead";
                }
                break;
            case "dead":
                break;
        }


    };

    this.draw = function(ctx) {
        switch(this.state) {
            case "casting":
                ctx.globalAlpha = .3;
                ctx.fillStyle = color;

                ctx.beginPath();
                ctx.moveTo(400, 300);
                ctx.arc(400, 300, r, dir - (cir / 2), dir + (cir / 2));
                ctx.fill();

                ctx.globalAlpha = .6;
                ctx.beginPath();
                ctx.moveTo(400, 300);
                ctx.arc(400, 300, r * this.curCastTime / castTime, dir - (cir / 2), dir + (cir / 2));
                ctx.fill();

                ctx.globalAlpha = 1;
                break;
            case "dead":
                break;
        }
    };
};

module.exports = Warrior;
},{}],5:[function(require,module,exports){
/**
 * Created by Kostya on 4/20/2015.
 */
var ClassScreen = function(socket, ctx, name, loginData) {
    var index = require("./../index");
    var game = require("./game_screen");

    var canvas = document.getElementById("myCanvas");

    var classSelected = "Warrior";
    var ready = "notReady";
    var players = [];

    var classText = "Welcome " + name + ", choose your class!";
    var selectedText = "Current class selected: ";
    var playerText = "Players logged in:";
    var readyButton = {x: 640, y: 560, w: 120, h: 30, text: "Ready up!"};
    var warriorButton = {x: 620, y: 100, w: 150, h: 30, text: "Warrior (Tank)"};
    var rogueButton = {x: 620, y: 140, w: 150, h: 30, text: "Rogue (DPS)"};
    var mageButton = {x: 620, y: 180, w: 150, h: 30, text: "Mage (DPS)"};
    var priestButton = {x: 620, y: 220, w: 150, h: 30, text: "Priest (Heal)"};

    for (var i = 0; i < loginData.playerData.length; i++) {
        players.push(loginData.playerData[i]);
    }

    this.update = function() {};

    this.draw = function() {
        ctx.clearRect(0, 0, 800, 600);
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(classText, 400 - ctx.measureText(classText).width / 2, 30);
        ctx.fillText(selectedText + classSelected, 400 - ctx.measureText(selectedText + classSelected).width / 2, 60);
        ctx.fillText(playerText, 20, 100);
        ctx.fillText("(You) " + name + " - " + classSelected, 30, 130);
        if(ready == "notReady") {
            ctx.fillStyle = "red";
        } else if (ready == "ready") {
            ctx.fillStyle = "green";
        }
        ctx.fillRect(5, 110, 20, 20);
        for (var i = 0; i < players.length; i++) {
            ctx.fillStyle = "black";
            var cur = players[i];
            ctx.fillText(cur.name + " - " + cur.classSelected, 30, 160 + i * 30);
            if(cur.ready == "notReady") {
                ctx.fillStyle = "red";
            } else if (cur.ready == "ready") {
                ctx.fillStyle = "green";
            } else if (cur.ready == "inGame") {
                ctx.fillStyle = "yellow";
            }
            ctx.fillRect(5, 140 + i * 30, 20, 20);
        }

        drawButton(ctx, readyButton);
        drawButton(ctx, warriorButton);
        drawButton(ctx, rogueButton);
        drawButton(ctx, mageButton);
        drawButton(ctx, priestButton);
    };

    this.checkKeys = function(e) {};

    this.doClick = function(e) {
        var offset = findOffset(canvas);
        var posX = e.pageX - offset.x;     //find the x position of the mouse
        var posY = e.pageY - offset.y;     //find the y position of the mouse

        if (checkButton(warriorButton, posX, posY) && classSelected != "Warrior") {
            classSelected = "Warrior";
            socket.emit('classChange', {classSelected: "Warrior"});
        } else if (checkButton(rogueButton, posX, posY) && classSelected != "Rogue") {
            classSelected = "Rogue";
            socket.emit('classChange', {classSelected: "Rogue"});
        } else if (checkButton(mageButton, posX, posY) && classSelected != "Mage") {
            classSelected = "Mage";
            socket.emit('classChange', {classSelected: "Mage"});
        } else if (checkButton(priestButton, posX, posY) && classSelected != "Priest") {
            classSelected = "Priest";
            socket.emit('classChange', {classSelected: "Priest"});
        } else if (checkButton(readyButton, posX, posY)) {
            ready = "ready";
            socket.emit('readyChange', {ready: ready});
            if (!ready) {
                readyButton.text = "Ready up!";
            } else {
                readyButton.text = "Unready!";
            }
        }
    };

    this.mouseMove = function(e) {};

    function playerConnected(data) {
        players.push(data);
    }

    function playerDisconnected(data) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].name == data.name) {
                players.splice(i, 1);
                return;
            }
        }
    }

    function classChange(data) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].name == data.name) {
                players[i].classSelected = data.classSelected;
                return;
            }
        }
    }

    function readyChange(data) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].name == data.name) {
                players[i].ready = data.ready;
                return;
            }
        }
    }

    function allReady(data) {
        unbind();
        index.changeScreen(new game(socket, ctx, name, classSelected, players, data));
    }

    function bind() {
        socket.on('playerConnected', playerConnected);
        socket.on('playerDisconnected', playerDisconnected);
        socket.on('classChange', classChange);
        socket.on('readyChange', readyChange);
        socket.on('allReady', allReady);
    }

    function unbind() {
        socket.removeListener('playerConnected', playerConnected);
        socket.removeListener('playerDisconnected', playerDisconnected);
        socket.removeListener('classChange', classChange);
        socket.removeListener('readyChange', readyChange);
        socket.removeListener('allReady', allReady);

    }

    bind();
};

function checkButton(button, x, y) {
    return x > button.x && x < button.x + button.w && y > button.y && y < button.y + button.h;
}

function drawButton(ctx, button) {
    ctx.fillStyle = "black";
    ctx.strokeRect(button.x, button.y, button.w, button.h);
    ctx.fillText(button.text, button.x + button.w / 2 - ctx.measureText(button.text).width / 2, button.y + button.h / 2 + 7);
}

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

module.exports = ClassScreen;
},{"./../index":8,"./game_screen":6}],6:[function(require,module,exports){
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
},{"./../classes/mage":1,"./../classes/priest":2,"./../classes/rogue":3,"./../classes/warrior":4}],7:[function(require,module,exports){
/**
 * Created by Kostya on 4/19/2015.
 */
var StartScreen = function(socket, ctx) {
    var index = require("./../index");
    var classScreen = require("./class_screen");

    var name = "";
    var failed = false;

    var startText = "Input your name, then press enter!";
    var failText = "Login Failed!";

    this.update = function() {};

    this.draw = function() {
        ctx.clearRect(0, 0, 800, 600);
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(startText, 400 - ctx.measureText(startText).width / 2, 100);
        ctx.fillText(name, 400 - ctx.measureText(name).width / 2, 200);
        if (failed) {
            ctx.fillText(failText, 400 - ctx.measureText(failText).width / 2, 400);
        }
    };

    this.checkKeys = function(e) {
        if (e.type == "keydown") {
            switch (e.keyCode) {
                case 8:
                    if (name.length > 0) {
                        name = name.slice(0, name.length - 1);
                    }
                    failed = false;
                    e.preventDefault();
                    break;
                case 13:
                    socket.emit('login', {name: name});
                    break;
                default:
                    name += String.fromCharCode(e.keyCode);
                    failed = false;
                    break;
            }
        }
        return false;
    };

    this.doClick = function(e) {};

    this.mouseMove = function(e) {};

    function loginSuccess(data) {
        unbind();
        index.changeScreen(new classScreen(socket, ctx, name, data));
    }

    function loginFailed() {
        failed = true;
    }

    function bind() {
        socket.on('loginSuccess', loginSuccess);
        socket.on('loginFailed', loginFailed);
    }

    function unbind() {
        socket.removeListener('loginSuccess', loginSuccess);
        socket.removeListener('loginFailed', loginFailed);
    }

    bind();
};

module.exports = StartScreen;
},{"./../index":8,"./class_screen":5}],8:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 * browserify index.js > bundle.js
 */
// Initialize connection with server
var socket = io();

var start = require("./client/start_screen");
var screen = null;

exports.changeScreen = function(newScreen) {
    screen = newScreen;
};

// Called at the beginning to initialize the event listeners on the canvas
window.onload = function() {
    var canvas = document.getElementById("myCanvas");
    screen = new start(socket, canvas.getContext('2d'));
    canvas.addEventListener('keydown', checkKeys, true);
    canvas.addEventListener('keyup', checkKeys, true);
    canvas.addEventListener('click', doClick, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    setInterval(updateLoop, 1000 / 60);
};

// Updates 60 times a second as well as draws the updated screen
function updateLoop() {
    screen.update();
    screen.draw();
}

function checkKeys(e) {
    screen.checkKeys(e);
}

function doClick(e) {
    screen.doClick(e);
}

function mouseMove(e) {
    screen.mouseMove(e);
}
},{"./client/start_screen":7}]},{},[8]);
