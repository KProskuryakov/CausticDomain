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