(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 */
// Represents the boss entities in the game
var Boss = function (x, y, r, health, maxHealth) {
    this.x = x; this.y = y;
    this.r = r;
    this.health = health;
    this.maxHealth = maxHealth;
};

// Server-side send initial boss values to client
Boss.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, r: this.r, health: this.health, maxHealth: this.maxHealth};
};

// Server-side boss update packet
Boss.prototype.getBossPacket = function() {
    return {x: this.x, y: this.y, health: this.health};
};

Boss.prototype.healthUpdate = function(damage, healing) {
    this.health = Math.max(Math.min(this.maxHealth, this.health - damage + healing), 0);
};

// Draws the boss
Boss.prototype.draw = function(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
};

// Draws the bosses health bar at the top of the screen
Boss.prototype.drawHealth = function(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(60, 20, 680, 30);

    ctx.fillStyle = "green";
    ctx.fillRect(60, 20, 680 * this.health / this.maxHealth, 30);
};

module.exports = Boss;
},{}],2:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 */
var Canvas = {};

Canvas.gameScreen = function() {
    this.keys = [];
    this.curKeyEvent = -1;

    this.draw = function() {
        Canvas.Game.boss.draw(Canvas.ctx);
        Canvas.Game.boss.drawHealth(Canvas.ctx);

        for (var i = 0; i < Canvas.Game.skillsAlive.length; i++) {
            Canvas.Game.skillsAlive[i].draw(Canvas.ctx);
        }

        for (i = 0; i < Canvas.Game.players.length; i++) {
            Canvas.Game.players[i].draw(Canvas.ctx);
        }

        Canvas.Game.myPlayer.draw(Canvas.ctx);
    };

    this.checkKeys = function(e) {
        this.keys[e.keyCode] = e.type == 'keydown';
        if (Canvas.Game.myPlayer.combatState == "normal") {
            if (this.keys[87] && this.keys[83] || this.keys[65] && this.keys[68] || !this.keys[87] && !this.keys[83] && !this.keys[65] && !this.keys[68]) {
                Canvas.Game.myPlayer.vel = 0;
                if (this.curKeyEvent != 0) {
                    this.curKeyEvent = 0;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[87] && this.keys[65]) {
                Canvas.Game.myPlayer.moveDir = -3 * Math.PI / 4;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 1) {
                    this.curKeyEvent = 1;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[87] && this.keys[68]) {
                Canvas.Game.myPlayer.moveDir = -Math.PI / 4;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 2) {
                    this.curKeyEvent = 2;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[83] && this.keys[65]) {
                Canvas.Game.myPlayer.moveDir = 3 * Math.PI / 4;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 3) {
                    this.curKeyEvent = 3;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[83] && this.keys[68]) {
                Canvas.Game.myPlayer.moveDir = Math.PI / 4;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 4) {
                    this.curKeyEvent = 4;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[87]) {
                Canvas.Game.myPlayer.moveDir = -Math.PI / 2;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 5) {
                    this.curKeyEvent = 5;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[83]) {
                Canvas.Game.myPlayer.moveDir = Math.PI / 2;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 6) {
                    this.curKeyEvent = 6;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[65]) {
                Canvas.Game.myPlayer.moveDir = Math.PI;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 7) {
                    this.curKeyEvent = 7;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[68]) {
                Canvas.Game.myPlayer.moveDir = 0;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 8) {
                    this.curKeyEvent = 8;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            }
        }
        return false;
    };

    this.doClick = function(e) {
        var offset = Canvas.findOffset(Canvas.canvas);
        var posX = e.pageX - offset.x;     //find the x position of the mouse
        var posY = e.pageY - offset.y;     //find the y position of the mouse

        Canvas.Game.myPlayer.cast(Canvas.Game, "click", posX, posY);
    };

    this.resetKeyEvent = function() {
        this.curKeyEvent = -1;
    };
};

Canvas.menuScreen = function() {
    this.name = "";

    this.draw = function() {
        Canvas.ctx.font = "30px Arial";
        Canvas.ctx.fillText("Input your name, then press enter!", 200, 100);
        Canvas.ctx.fillText("" + this.name, 200, 200);
    };

    this.checkKeys = function(e) {
        if (e.type == "keydown") {
            switch (e.keyCode) {
                case 8:
                    if (this.name.length > 0) {
                        this.name = this.name.slice(0, this.name.length - 1);
                    }
                    e.preventDefault();
                    break;
                case 13:
                    Canvas.socket.emit('login', {name: this.name});
                    break;
                default:
                    this.name += String.fromCharCode(e.keyCode);
                    break;
            }
        }
        return false;
    };

    this.doClick = function(e) {};
};

Canvas.classSelect = function() {
    this.classSelected = 0;

    this.draw = function() {};

    this.checkKeys = function(e) {};

    this.doClick = function(e) {};
};

Canvas.screen = new Canvas.menuScreen();

// The draw loop that draws all game objects on screen
Canvas.draw = function() {
    Canvas.ctx.clearRect(0, 0, 800, 600);
    Canvas.screen.draw();
};

Canvas.findOffset = function(obj) {
    var curX = 0;
    var curY = 0;
    if (obj.offsetParent) {   //if the browser supports offsetParent then we can use it
        do {
            curX += obj.offsetLeft;  //get left position of the obj and add it to the var.
            curY += obj.offsetTop;   //gets top position and add it to the var.
        } while (obj = obj.offsetParent);

        return {x:curX, y:curY};  //this is a function that returns two values
    }
};

// TODO replace all inner if-statements with a single function
// Callback when any key event occurs during the game
Canvas.checkKeys = function(e) {
    e = e || event; // to deal with IE
    Canvas.screen.checkKeys(e);
};

Canvas.keyType = function(e) {
    Canvas.screen.keyType(e);
};

Canvas.doClick = function(e) {
    Canvas.screen.doClick(e);
};

module.exports = Canvas;

},{}],3:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 */
var Game = {};

Game.Player = require("./player");
Game.Boss = require("./boss");
Game.Skill = require("./skill");

Game.state = "notLoggedIn"; // Possible states: notLoggedIn, loggedIn


// The time value of the last dt update
Game.lastUpdate = new Date().getTime();

Game.myPlayer = null;
Game.players = [];
Game.boss = null;

Game.skillsAlive = [];

Game.initMyPlayer = function(packet, socket) {
    Game.myPlayer = new Game.Player(packet.x, packet.y, 10, 100, socket, packet.name, Game);
};


Game.initPlayer = function (packet) {
    var newPlayer = new Game.Player(packet.x, packet.y, 10, 100, null, packet.name, Game);
    newPlayer.vel = packet.vel;
    newPlayer.moveDir = packet.moveDir;
    Game.players.push(newPlayer);
};

Game.initPlayers = function(playerData) {
    for (var i = 0; i < playerData.length; i++) {
        Game.initPlayer(playerData[i]);
    }
};

Game.initBoss = function(boss) {
    Game.boss = new Game.Boss(boss.x, boss.y, boss.r, boss.health, boss.maxHealth);
};

Game.moveChange = function(data) {
    if (Game.state == "loggedIn") {
        var player = Game.getPlayer(data.name);
        player.x = data.x;
        player.y = data.y;
        player.vel = data.vel;
        player.moveDir = data.moveDir;
    }
};

Game.removePlayer = function(name) {
    for (var i = 0; i < Game.players.length; i++) {
        if (Game.players[i].name == name) {
            Game.players.splice(i, 1);
        }
    }
};

Game.getPlayer = function(name) {
    for (var i = 0; i < Game.players.length; i++) {
        if (Game.players[i].name == name) {
            return Game.players[i];
        }
    }
};

Game.changeState = function(newState) {
    switch(newState) {
        case "loggedIn":
            Game.state = newState;
            Game.Canvas.screen = new Game.Canvas.gameScreen();
            break;
    }
};

// The update loop that iterates through all game objects
Game.update = function () {
    var dt = (new Date().getTime() - Game.lastUpdate) / 1000;

    if (Game.state == "loggedIn") {
        Game.myPlayer.update(dt);
        for (var i = 0; i < Game.players.length; i++) {
            Game.players[i].update(dt);
        }
        for (i = 0; i < Game.skillsAlive.length; i++) {
            var cur = Game.skillsAlive[i];
            if (cur.dead) {
                Game.skillsAlive.splice(i, 1);
                i--;
            } else {
                cur.clientUpdate(dt, Game.myPlayer, Game.boss);
            }
        }
    }

    Game.lastUpdate = new Date().getTime();
};

Game.cast = function(x, y, posX, posY) {


    Game.skillsAlive.push();
};

module.exports = Game;
},{"./boss":1,"./player":5,"./skill":6}],4:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 * browserify index.js > bundle.js
 */
// Initialize connection with server
var socket = io();

// Browserify boilerplate, initializes all instances of module code
var Game = require("./client_game.js");
var Canvas = require("./canvas.js");

Canvas.Game = Game;
Game.Canvas = Canvas;


// Called at the beginning to initialize the event listeners on the canvas
window.onload = function() {
    var canvas = document.getElementById("myCanvas");
    Canvas.canvas = canvas;
    Canvas.ctx = canvas.getContext("2d");
    canvas.addEventListener('keydown', Canvas.checkKeys, true);
    canvas.addEventListener('keyup', Canvas.checkKeys, true);
    canvas.addEventListener('click', Canvas.doClick, false);
    Canvas.socket = socket;
};


// Server sends client data upon login
socket.on('loginSuccess', function (data) {
    Game.initMyPlayer(data.player, socket);
    Game.initPlayers(data.playerData);
    Game.initBoss(data.bossData);
    Game.changeState("loggedIn");
});

// Server rejects client login
socket.on('loginFailed', function() {
    console.log("Login Failed!");
});

// A change in another player's movement was detected and sent
socket.on('moveChange', function(data) {
    Game.moveChange(data);
});

socket.on('playerConnected', function(data) {
    Game.initPlayer(data);
});

// A player disconnected!
socket.on('playerDisconnected', function(data) {
    Game.removePlayer(data.name);
});

socket.on('bossUpdate', function(data) {
    Game.boss.healthUpdate(data.damage, data.healing);
});

// Updates 60 times a second as well as draws the updated screen
function updateLoop() {
    Game.update();
    Canvas.draw();
}

setInterval(updateLoop, 1000 / 60);
},{"./canvas.js":2,"./client_game.js":3}],5:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 */
// Represents the human entities in the game
function Player(x, y, r, maxHealth, socket, name, Game) {
    this.x = x; this.y = y;
    this.ix = x; this.iy = y;
    this.r = r;
    this.vel = 0; this.moveDir = 0;
    this.ivel = 115;

    this.socket = socket;
    this.name = name;

    this.health = maxHealth;
    this.maxHealth = maxHealth;

    this.combatState = "normal";
    this.revertTimer = 0;

    this.Game = Game;

    this.skills = {
        click: new Game.Skill(this.x, this.y, 0, 60, Math.PI / 2, 2.5, 0, 25, 0, 0, "brown")
    };
}

// Server-side for the player to send initial position to new connector
Player.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, name: this.name};
};

// Constructs an update packet that contains the location and velocity of the player
Player.prototype.getMovePacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, name: this.name};
};

Player.prototype.copySkill = function(id, dir) {
    var original = this.skills[id];
    return new this.Game.Skill(this.x, this.y, dir, original.r, original.cir, original.castTime, original.aDamage, original.eDamage, original.aHealing, original.eHealing, original.color);
};

Player.prototype.cast = function(Game, id, posX, posY) {
    if (this.combatState == "normal") {
        var sDir = Math.atan2(posY - this.y, posX - this.x);
        var skill = this.copySkill(id, sDir);
        this.combatState = "casting";
        this.revertTimer = skill.castTime;
        if (this.vel != 0) {
            this.vel = 0;
            this.socket.emit("moveChange", this.getMovePacket());
        }
        Game.skillsAlive.push(skill);
    }
};

// Increments the player's position
Player.prototype.update = function(dt) {
    if (this.combatState != "normal") {
        this.revertTimer -= dt;
        if (this.revertTimer < 0) {
            this.combatState = "normal";
            this.Game.Canvas.screen.resetKeyEvent();
        } else {
            return;
        }
    }
    if (this.vel != 0) {
        var xinc = Math.cos(this.moveDir) * this.vel * dt;
        var yinc = Math.sin(this.moveDir) * this.vel * dt;
        this.x += xinc; this.ix += xinc;
        this.y += yinc; this.iy += yinc;
    }
    if (Math.abs(this.ix - this.x) < 5 && Math.abs(this.iy - this.y) < 5) {
        this.ix = this.x;
        this.iy = this.y;
    } else {
        var idir = Math.atan2(this.y - this.iy, this.x - this.ix);
        this.ix += Math.cos(idir) * this.ivel * dt;
        this.iy += Math.sin(idir) * this.ivel * dt;
    }
};

// Draws the player on the canvas' context
Player.prototype.draw = function(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.ix, this.iy, this.r, 0, 2 * Math.PI);
    ctx.fill();
};

module.exports = Player;
},{}],6:[function(require,module,exports){
/**
 * Created by Kostya on 4/9/2015.
 */
var Skill = function(x, y, dir, r, cir, castTime, aDamage, eDamage, aHealing, eHealing, color) {
    this.x = x; this.y = y; this.dir = dir; this.r = r; this.cir = cir; this.currentCast = 0;
    this.castTime = castTime; this.aDamage = aDamage; this.eDamage = eDamage; this.aHealing = aHealing;
    this.eHealing = eHealing; this.color = color; this.dead = false;
};

// This is done
Skill.prototype.draw = function(ctx) {
    if (this.dead) {
        return;
    }
    ctx.globalAlpha = .3;
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.r, this.dir - (this.cir / 2), this.dir + (this.cir / 2));
    ctx.fill();

    ctx.globalAlpha = .6;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.r * this.currentCast / this.castTime, this.dir - (this.cir / 2), this.dir + (this.cir / 2));
    ctx.fill();

    ctx.globalAlpha = 1;
};


Skill.prototype.clientUpdate = function(dt, myPlayer, boss) {
    this.currentCast += dt;
    if (this.currentCast > this.castTime) {
        this.dead = true;
        var pDir = Math.atan2(myPlayer.y - this.y, myPlayer.x - this.x);
        var bDir = Math.atan2(boss.y - this.y, boss.x - this.x);
        var pDist = Math.pow(myPlayer.x - this.x, 2) + Math.pow(myPlayer.y - this.y, 2) < Math.pow(this.r + myPlayer.r, 2);
        var bDist = Math.pow(boss.x - this.x, 2) + Math.pow(boss.y - this.y, 2) < Math.pow(this.r + boss.r, 2);

        var pAngle = (pDir - this.dir) % (Math.PI * 2);
        var bAngle = (bDir - this.dir) % (Math.PI * 2);

        if (pDist && pAngle <= this.cir / 2 && pAngle >= this.cir / -2) {
            myPlayer.health = Math.max(Math.min(myPlayer.maxHealth, myPlayer.health - this.aDamage + this.aHealing), 0);
        }
        if (bDist && bAngle <= this.cir / 2 && bAngle >= this.cir / -2) {
            boss.healthUpdate(this.eDamage, this.eHealing);
            myPlayer.socket.emit("bossUpdate", {damage: this.eDamage, healing: this.eHealing});
        }
    }
};

module.exports = Skill;
},{}]},{},[4]);
