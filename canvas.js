/**
 * Created by Kostya on 4/8/2015.
 */
var Canvas = {};

// The draw loop that draws all game objects on screen
Canvas.draw = function(myPlayer, otherPlayer, boss) {
    Canvas.ctx.clearRect(0, 0, 800, 600);

    myPlayer.draw(Canvas.ctx);
    otherPlayer.draw(Canvas.ctx);
    boss.draw(Canvas.ctx);

    boss.drawHealth(Canvas.ctx);
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
