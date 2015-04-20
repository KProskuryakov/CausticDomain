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