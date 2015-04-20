/**
 * Created by Kostya on 4/20/2015.
 */
var ClassScreen = function(socket, ctx, name, loginData) {
    var socket = socket;
    var ctx = ctx;
    var canvas = document.getElementById("myCanvas");

    var name = name;
    var classSelected = "Warrior";
    var ready = false;
    var players = [];

    var classText = "Welcome " + name + ", choose your class!";
    var selectedText = "Current class selected: " + classSelected;
    var readyText = "Ready: ";
    var playerText = "Players logged in:";
    var readyButton = {x: 640, y: 560, w: 120, h: 30, text: "Ready Up!"};
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
        ctx.fillText(classText, 400 - ctx.measureText(classText).width / 2, 30);
        ctx.fillText(selectedText, 400 - ctx.measureText(selectedText).width / 2, 60);
        ctx.fillText(readyText + ready, 650, 530);
        ctx.fillText(playerText, 20, 100);
        for (var i = 0; i < players.length; i++) {
            var cur = players[i];
            ctx.fillText(cur.name + " - " + cur.classSelected, 20, 130 + i * 30);
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
        }
    };

    this.mouseMove = function(e) {};

    socket.on('playerConnected', function(data) {
        players.push(data);
    });

    socket.on('playerDisconnected', function(data) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].name == data.name) {
                players.splice(i, 1);
                return;
            }
        }
    });
};

function checkButton(button, x, y) {
    return x > button.x && x < button.x + button.w && y > button.y && y < button.y + button.h;
}

function drawButton(ctx, button) {
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