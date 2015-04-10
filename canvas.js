/**
 * Created by Kostya on 4/8/2015.
 */
var Canvas = {};

Canvas.gameScreen = function() {};

Canvas.menuScreen = function() {
    this.name = "";
};

Canvas.screen = new Canvas.menuScreen();

// The draw loop that draws all game objects on screen
Canvas.draw = function() {
    Canvas.ctx.clearRect(0, 0, 800, 600);
    Canvas.screen.draw();
};

Canvas.gameScreen.prototype.draw = function() {
    for (var i = 0; i < Canvas.Game.skillsAlive.length; i++) {
        Canvas.Game.skillsAlive[i].draw(Canvas.ctx);
    }

    for (var j = 0; i < Canvas.Game.players.length; i++) {
        Canvas.Game.players[i].draw(Canvas.ctx);
    }

    Canvas.Game.myPlayer.draw(Canvas.ctx);
};

Canvas.menuScreen.prototype.draw = function() {
    Canvas.ctx.font = "30px Arial";
    Canvas.ctx.fillText("Input your name, then press enter!", 200, 100);
    Canvas.ctx.fillText("" + this.name, 200, 200);
};

Canvas.gameScreen.prototype.checkKeys = function(e) {
    Canvas.keys[e.keyCode] = e.type == 'keydown';
    if (Canvas.keys[87] && Canvas.keys[83] || Canvas.keys[65] && Canvas.keys[68] || !Canvas.keys[87] && !Canvas.keys[83] && !Canvas.keys[65] && !Canvas.keys[68]) {
        Canvas.Game.myPlayer.vel = 0;
        if (Canvas.curKeyEvent != 0) {
            Canvas.curKeyEvent = 0;
            Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[87] && Canvas.keys[65]) {
        Canvas.Game.myPlayer.moveDir = -3 * Math.PI / 4;
        Canvas.Game.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 1) {
            Canvas.curKeyEvent = 1;
            Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[87] && Canvas.keys[68]) {
        Canvas.Game.myPlayer.moveDir = -Math.PI / 4;
        Canvas.Game.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 2) {
            Canvas.curKeyEvent = 2;
            Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[83] && Canvas.keys[65]) {
        Canvas.Game.myPlayer.moveDir = 3 * Math.PI / 4;
        Canvas.Game.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 3) {
            Canvas.curKeyEvent = 3;
            Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[83] && Canvas.keys[68]) {
        Canvas.Game.myPlayer.moveDir = Math.PI / 4;
        Canvas.Game.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 4) {
            Canvas.curKeyEvent = 4;
            Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[87]) {
        Canvas.Game.myPlayer.moveDir = -Math.PI / 2;
        Canvas.Game.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 5) {
            Canvas.curKeyEvent = 5;
            Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[83]) {
        Canvas.Game.myPlayer.moveDir = Math.PI / 2;
        Canvas.Game.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 6) {
            Canvas.curKeyEvent = 6;
            Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[65]) {
        Canvas.Game.myPlayer.moveDir = Math.PI;
        Canvas.Game.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 7) {
            Canvas.curKeyEvent = 7;
            Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
        }
    } else if (Canvas.keys[68]) {
        Canvas.Game.myPlayer.moveDir = 0;
        Canvas.Game.myPlayer.vel = 100;
        if (Canvas.curKeyEvent != 8) {
            Canvas.curKeyEvent = 8;
            Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
        }
    }
    return false;
};

Canvas.menuScreen.prototype.checkKeys = function(e) {
    if (e.type == "keydown") {
        switch (e.keyCode) {
            case 8:
                if (this.name.length > 0) {
                    this.name = this.name.slice(0, this.name.length - 1);
                }
                e.preventDefault();
                break;
            case 13:
                    Canvas.socket.emit('login', {name: this.name});
                break;
            default:
                this.name += String.fromCharCode(e.keyCode);
                break;
        }
    }
    return false;
};

Canvas.doClick = function(e) {
    var offset = Canvas.findOffset(Canvas.canvas);
    var posX = e.pageX - offset.x;     //find the x position of the mouse
    var posY = e.pageY - offset.y;     //find the y position of the mouse

    //Canvas.Game.cast(Canvas.Game.myPlayer.x, Canvas.Game.myPlayer.y, posX, posY);
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

// TODO replace all inner if-statements with a single function
// Callback when any key event occurs during the game
Canvas.checkKeys = function(e) {
    e = e || event; // to deal with IE
    Canvas.screen.checkKeys(e);
};

Canvas.keyType = function(e) {
    Canvas.screen.keyType(e);
};

module.exports = Canvas;
