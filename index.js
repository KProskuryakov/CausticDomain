/**
 * Created by Kostya on 4/8/2015.
 * browserify index.js > bundle.js
 */
// Initialize connection with server
var socket = io();

// Represents the human entities in the game
var Player = function(x, y, num) {
    this.x = x; this.y = y;
    this.vel = 0; this.moveDir = 0;
    this.num = num;
};

// Constructs an update packet that contains the location and velocity of the player
Player.prototype.getMovePacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, num: this.num};
};

// Increments the player's position
Player.prototype.update = function(dt) {
    if (this.vel != 0) {
        this.x += Math.cos(this.moveDir) * this.vel * dt;
        this.y += Math.sin(this.moveDir) * this.vel * dt;
    }
};

// Draws the player on the canvas' context
Player.prototype.draw = function(ctx) {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
};


// Represents the boss entities in the game
var Boss = function (x, y, health) {
    this.x = x; this.y = y;
    this.health = health;
    this.maxHealth = health;
};

// Draws the boss
Boss.prototype.draw = function(ctx) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI);
    ctx.stroke();
};

// Draws the bosses health bar at the top of the screen
Boss.prototype.drawHealth = function(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(60, 20, 680, 30);

    ctx.fillStyle = "green";
    ctx.fillRect(60, 20, 680 * this.health / this.maxHealth, 30);
};


var Skill = function(x, y, dir, r, cir, castTime, hitsPlayers, hitsEnemies, damage, healing) {

};

// Declare and initialize the players
var myPlayer = new Player(0, 0, 0);
var otherPlayer = new Player(0, 0, 0);

// Declare the boss
var boss = new Boss(0, 0, 0);

// Declare the namespaces for various functions
var Canvas = {};
var Game = {};

// Called at the beginning to initialize the event listeners on the canvas
window.onload = function() {
    var canvas = document.getElementById("myCanvas");
    Canvas.ctx = canvas.getContext("2d");
    canvas.addEventListener('keydown', checkKeys, true);
    canvas.addEventListener('keyup', checkKeys, true);
};

Canvas.keys = [];
Canvas.curKeyEvent = -1;

function checkKeys(e) {
    e = e || event; // to deal with IE
    Canvas.keys[e.keyCode] = e.type == 'keydown';
    if (Canvas.keys[87] && Canvas.keys[83] || Canvas.keys[65] && Canvas.keys[68] || !Canvas.keys[87] && !Canvas.keys[83] && !Canvas.keys[65] && !Canvas.keys[68]) {
        myPlayer.vel = 0;
        if (Canvas.curKeyEvent != 0) {
            Canvas.curKeyEvent = 0;
            socket.emit("moveChange", myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[87] && Canvas.keys[65]) {
        myPlayer.moveDir = -3 * Math.PI / 4;
        myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 1) {
            Canvas.curKeyEvent = 1;
            socket.emit("moveChange", myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[87] && Canvas.keys[68]) {
        myPlayer.moveDir = -Math.PI / 4;
        myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 2) {
            Canvas.curKeyEvent = 2;
            socket.emit("moveChange", myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[83] && Canvas.keys[65]) {
        myPlayer.moveDir = 3 * Math.PI / 4;
        myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 3) {
            Canvas.curKeyEvent = 3;
            socket.emit("moveChange", myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[83] && Canvas.keys[68]) {
        myPlayer.moveDir = Math.PI / 4;
        myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 4) {
            Canvas.curKeyEvent = 4;
            socket.emit("moveChange", myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[87]) {
        myPlayer.moveDir = -Math.PI / 2;
        myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 5) {
            Canvas.curKeyEvent = 5;
            socket.emit("moveChange", myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[83]) {
        myPlayer.moveDir = Math.PI / 2;
        myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 6) {
            Canvas.curKeyEvent = 6;
            socket.emit("moveChange", myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[65]) {
        myPlayer.moveDir = Math.PI;
        myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 7) {
            Canvas.curKeyEvent = 7;
            socket.emit("moveChange", myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[68]) {
        myPlayer.moveDir = 0;
        myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 8) {
            Canvas.curKeyEvent = 8;
            socket.emit("moveChange", myPlayer.getMovePacket());
        }
    }
    return false;
}


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



Game.lastUpdate = new Date().getTime();

Game.update = function () {
    var dt = (new Date().getTime() - Game.lastUpdate) / 1000;

    myPlayer.update(dt);
    otherPlayer.update(dt);

    Game.lastUpdate = new Date().getTime();
};

Canvas.draw = function() {
    Canvas.ctx.clearRect(0, 0, 800, 600);

    myPlayer.draw(Canvas.ctx);
    otherPlayer.draw(Canvas.ctx);
    boss.draw(Canvas.ctx);

    boss.drawHealth(Canvas.ctx);
};

function updateLoop() {
    Game.update();
    Canvas.draw();
}

setInterval(updateLoop, 1000 / 60);