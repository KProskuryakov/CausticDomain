(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 */
// Represents the boss entities in the game
var Boss = function (x, y, r, health) {
    this.x = x; this.y = y;
    this.r = r;
    this.health = health;
    this.maxHealth = health;
};

// Server-side send initial boss values to client
Boss.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, health: this.health, maxHealth: this.maxHealth};
};

// Server-side boss update packet
Boss.prototype.getBossPacket = function(){
    return {x: this.x, y: this.y, health: this.health};
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

// The draw loop that draws all game objects on screen
Canvas.draw = function(myPlayer, otherPlayer, boss) {
    Canvas.ctx.clearRect(0, 0, 800, 600);

    for (var i = 0; i < Canvas.Game.skillsAlive.length; i++) {
        Canvas.Game.skillsAlive[i].draw(Canvas.ctx);
    }


    myPlayer.draw(Canvas.ctx);
    otherPlayer.draw(Canvas.ctx);
    boss.draw(Canvas.ctx);

    boss.drawHealth(Canvas.ctx);
};

Canvas.doClick = function(e) {
    var offset = Canvas.findOffset(Canvas.canvas);
    var posX = e.pageX - offset.x;     //find the x position of the mouse
    var posY = e.pageY - offset.y;     //find the y position of the mouse

    //e.target.myPlayer.cast(posX, posY);
    Canvas.Game.cast(e.target.myPlayer.x, e.target.myPlayer.y, posX, posY);
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

Canvas.keys = [];
Canvas.curKeyEvent = -1;

// Callback when any key event occurs during the game
Canvas.checkKeys = function(e) {
    e = e || event; // to deal with IE
    Canvas.keys[e.keyCode] = e.type == 'keydown';
    if (Canvas.keys[87] && Canvas.keys[83] || Canvas.keys[65] && Canvas.keys[68] || !Canvas.keys[87] && !Canvas.keys[83] && !Canvas.keys[65] && !Canvas.keys[68]) {
        e.target.myPlayer.vel = 0;
        if (Canvas.curKeyEvent != 0) {
            Canvas.curKeyEvent = 0;
            e.target.socket.emit("moveChange", e.target.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[87] && Canvas.keys[65]) {
        e.target.myPlayer.moveDir = -3 * Math.PI / 4;
        e.target.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 1) {
            Canvas.curKeyEvent = 1;
            e.target.socket.emit("moveChange", e.target.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[87] && Canvas.keys[68]) {
        e.target.myPlayer.moveDir = -Math.PI / 4;
        e.target.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 2) {
            Canvas.curKeyEvent = 2;
            e.target.socket.emit("moveChange", e.target.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[83] && Canvas.keys[65]) {
        e.target.myPlayer.moveDir = 3 * Math.PI / 4;
        e.target.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 3) {
            Canvas.curKeyEvent = 3;
            e.target.socket.emit("moveChange", e.target.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[83] && Canvas.keys[68]) {
        e.target.myPlayer.moveDir = Math.PI / 4;
        e.target.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 4) {
            Canvas.curKeyEvent = 4;
            e.target.socket.emit("moveChange", e.target.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[87]) {
        e.target.myPlayer.moveDir = -Math.PI / 2;
        e.target.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 5) {
            Canvas.curKeyEvent = 5;
            e.target.socket.emit("moveChange", e.target.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[83]) {
        e.target.myPlayer.moveDir = Math.PI / 2;
        e.target.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 6) {
            Canvas.curKeyEvent = 6;
            e.target.socket.emit("moveChange", e.target.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[65]) {
        e.target.myPlayer.moveDir = Math.PI;
        e.target.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 7) {
            Canvas.curKeyEvent = 7;
            e.target.socket.emit("moveChange", e.target.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[68]) {
        e.target.myPlayer.moveDir = 0;
        e.target.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 8) {
            Canvas.curKeyEvent = 8;
            e.target.socket.emit("moveChange", e.target.myPlayer.getMovePacket());
        }
    }
    return false;
};

module.exports = Canvas;

},{}],3:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 */
var Game = {};

// The time value of the last dt update
Game.lastUpdate = new Date().getTime();

Game.skillsAlive = [];

// The update loop that iterates through all game objects
Game.update = function (myPlayer, otherPlayer, boss) {
    var dt = (new Date().getTime() - Game.lastUpdate) / 1000;

    myPlayer.update(dt);
    otherPlayer.update(dt);

    for (var i = 0; i < Game.skillsAlive.length; i++) {
        var cur = Game.skillsAlive[i];
        if (cur.dead) {
            Game.skillsAlive.splice(i, 1);
            i--;
        } else {
            cur.clientUpdate(dt, myPlayer, boss);
        }
    }

    Game.lastUpdate = new Date().getTime();
};

Game.cast = function(x, y, posX, posY) {
    var sDir = Math.atan2(posY - y, posX - x);

    Game.skillsAlive.push(new Game.Skill(x, y, sDir, 60, Math.PI / 2, 2.5, 0, 25, 0, 0, "brown"));
};

module.exports = Game;
},{}],4:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 * browserify index.js > bundle.js
 */
// Initialize connection with server
var socket = io();

// Browserify boilerplate, initializes all instances of module code
var Game = require("./client_game.js");
var Canvas = require("./canvas.js");
var Player = require("./player.js");
var Boss = require("./boss.js");
var Skill = require("./skill.js");

Canvas.Game = Game;
Game.Skill = Skill;


// Declare and initialize the players
var myPlayer = new Player(0, 0, 10, 0, 0);
var otherPlayer = new Player(0, 0, 10, 0, 0);

// Declare the boss
var boss = new Boss(0, 0, 50, 0);

// Called at the beginning to initialize the event listeners on the canvas
window.onload = function() {
    var canvas = document.getElementById("myCanvas");
    Canvas.canvas = canvas;
    Canvas.ctx = canvas.getContext("2d");
    canvas.addEventListener('keydown', Canvas.checkKeys, true);
    canvas.addEventListener('keyup', Canvas.checkKeys, true);
    canvas.addEventListener('click', Canvas.doClick, false);
    canvas.myPlayer = myPlayer;
    canvas.socket = socket;
};


// Server sends client data upon first connecting
socket.on('start', function (data) {
    myPlayer.num = data.num;

    if (data.player != null) {
        otherPlayer.x = data.player.x;
        otherPlayer.y = data.player.y;
        otherPlayer.vel = data.player.vel;
        otherPlayer.moveDir = data.player.moveDir;
    }

    boss.x = data.boss.x;
    boss.y = data.boss.y;
    boss.health = data.boss.health;
    boss.maxHealth = data.boss.maxHealth;
});

// A change in another player's movement was detected and sent
socket.on('moveChange', function (data) {
    otherPlayer.x = data.x;
    otherPlayer.y = data.y;
    otherPlayer.vel = data.vel;
    otherPlayer.moveDir = data.moveDir;
});

// A change in the boss was sent
socket.on('bossUpdate', function (data) {
    boss.x = data.x;
    boss.y = data.y;
    boss.health = data.health;
});

// Updates 60 times a second as well as draws the updated screen
function updateLoop() {
    Game.update(myPlayer, otherPlayer, boss);
    Canvas.draw(myPlayer, otherPlayer, boss);
}

setInterval(updateLoop, 1000 / 60);
},{"./boss.js":1,"./canvas.js":2,"./client_game.js":3,"./player.js":5,"./skill.js":6}],5:[function(require,module,exports){
/**
 * Created by Kostya on 4/8/2015.
 */
// Represents the human entities in the game
function Player(x, y, r, maxHealth, num, socket) {
    this.x = x; this.y = y;
    this.ix = x; this.iy = y;
    this.r = r;
    this.vel = 0; this.moveDir = 0;
    this.ivel = 115;
    this.num = num;
    this.socket = socket;

    this.health = maxHealth;
    this.maxHealth = maxHealth;
}

// Server-side for the player to send initial position to new connector
Player.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, num: this.num};
};

// Constructs an update packet that contains the location and velocity of the player
Player.prototype.getMovePacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, num: this.num};
};

// Increments the player's position
Player.prototype.update = function(dt) {
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

        console.log(this.cir);

        if (pDist && pAngle <= this.cir / 2 && pAngle >= this.cir / -2) {
            myPlayer.health = Math.min(myPlayer.maxHealth, myPlayer.health - this.aDamage + this.aHealing);
        }
        if (bDist && bAngle <= this.cir / 2 && bAngle >= this.cir / -2) {
            boss.health = Math.min(boss.maxHealth, boss.health - this.eDamage + this.eHealing);
        }
    }
};

module.exports = Skill;
},{}]},{},[4]);
