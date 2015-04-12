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