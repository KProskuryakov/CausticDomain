(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Kostya on 4/20/2015.
 */
var ClassScreen = function(socket, ctx, name, loginData) {
    var canvas = document.getElementById("myCanvas");

    var classSelected = "Warrior";
    var ready = false;
    var players = [];

    var classText = "Welcome " + name + ", choose your class!";
    var selectedText = "Current class selected: ";
    var readyText = "Ready: ";
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
        ctx.fillText(selectedText + classSelected, 400 - ctx.measureText(selectedText).width / 2, 60);
        ctx.fillText(playerText, 20, 100);
        ctx.fillText("(You) " + name + " - " + classSelected, 30, 130);
        if(ready) {
            ctx.fillStyle = "green";
        } else {
            ctx.fillStyle = "red";
        }
        ctx.fillRect(5, 110, 20, 20);
        for (var i = 0; i < players.length; i++) {
            ctx.fillStyle = "black";
            var cur = players[i];
            ctx.fillText(cur.name + " - " + cur.classSelected, 30, 160 + i * 30);
            if (cur.ready) {
                ctx.fillStyle = "green";
            } else {
                ctx.fillStyle = "red";
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
            ready = !ready;
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

    function bind() {
        socket.on('playerConnected', playerConnected);
        socket.on('playerDisconnected', playerDisconnected);
        socket.on('classChange', classChange);
        socket.on('readyChange', readyChange);
    }

    function unbind() {
        socket.removeListener('playerConnected', playerConnected);
        socket.removeListener('playerDisconnected', playerDisconnected);
        socket.removeListener('classChange', classChange);
        socket.removeListener('readyChange', readyChange);
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
},{}],2:[function(require,module,exports){
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
},{"./../index":3,"./class_screen":1}],3:[function(require,module,exports){
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
},{"./client/start_screen":2}]},{},[3]);
