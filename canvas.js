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
