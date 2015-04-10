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

Player.Skill = Skill;


// Declare and initialize the players
var myPlayer = new Player(0, 0, 0);
var otherPlayer = new Player(0, 0, 0);

// Declare the boss
var boss = new Boss(0, 0, 0);

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
    Game.update(myPlayer, otherPlayer);
    Canvas.draw(myPlayer, otherPlayer, boss);
}

setInterval(updateLoop, 1000 / 60);