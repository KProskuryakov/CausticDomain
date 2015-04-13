/**
 * Created by Kostya on 4/8/2015.
 */
var Canvas = {};

Canvas.gameScreen = function() {
    this.keys = [];
    this.curKeyEvent = -1;

    this.draw = function() {
        Canvas.Game.boss.draw(Canvas.ctx);
        Canvas.Game.boss.drawHealth(Canvas.ctx);

        for (var i = 0; i < Canvas.Game.skillsAlive.length; i++) {
            Canvas.Game.skillsAlive[i].draw(Canvas.ctx);
        }

        for (i = 0; i < Canvas.Game.players.length; i++) {
            Canvas.Game.players[i].draw(Canvas.ctx);
        }

        Canvas.Game.myPlayer.draw(Canvas.ctx);
    };

    this.checkKeys = function(e) {
        this.keys[e.keyCode] = e.type == 'keydown';
        if (Canvas.Game.myPlayer.combatState == "normal") {
            if (this.keys[87] && this.keys[83] || this.keys[65] && this.keys[68] || !this.keys[87] && !this.keys[83] && !this.keys[65] && !this.keys[68]) {
                Canvas.Game.myPlayer.vel = 0;
                if (this.curKeyEvent != 0) {
                    this.curKeyEvent = 0;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[87] && this.keys[65]) {
                Canvas.Game.myPlayer.moveDir = -3 * Math.PI / 4;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 1) {
                    this.curKeyEvent = 1;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[87] && this.keys[68]) {
                Canvas.Game.myPlayer.moveDir = -Math.PI / 4;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 2) {
                    this.curKeyEvent = 2;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[83] && this.keys[65]) {
                Canvas.Game.myPlayer.moveDir = 3 * Math.PI / 4;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 3) {
                    this.curKeyEvent = 3;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[83] && this.keys[68]) {
                Canvas.Game.myPlayer.moveDir = Math.PI / 4;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 4) {
                    this.curKeyEvent = 4;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[87]) {
                Canvas.Game.myPlayer.moveDir = -Math.PI / 2;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 5) {
                    this.curKeyEvent = 5;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[83]) {
                Canvas.Game.myPlayer.moveDir = Math.PI / 2;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 6) {
                    this.curKeyEvent = 6;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[65]) {
                Canvas.Game.myPlayer.moveDir = Math.PI;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 7) {
                    this.curKeyEvent = 7;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            } else if (this.keys[68]) {
                Canvas.Game.myPlayer.moveDir = 0;
                Canvas.Game.myPlayer.vel = 100;
                if (this.curKeyEvent != 8) {
                    this.curKeyEvent = 8;
                    Canvas.socket.emit("moveChange", Canvas.Game.myPlayer.getMovePacket());
                }
            }
        }
        return false;
    };

    this.doClick = function(e) {
        var offset = Canvas.findOffset(Canvas.canvas);
        var posX = e.pageX - offset.x;     //find the x position of the mouse
        var posY = e.pageY - offset.y;     //find the y position of the mouse

        Canvas.Game.myPlayer.cast(Canvas.Game, "click", posX, posY);
    };

    this.resetKeyEvent = function() {
        this.curKeyEvent = -1;
    };
};

Canvas.menuScreen = function() {
    this.name = "";

    this.draw = function() {
        Canvas.ctx.font = "30px Arial";
        Canvas.ctx.fillText("Input your name, then press enter!", 200, 100);
        Canvas.ctx.fillText("" + this.name, 200, 200);
    };

    this.checkKeys = function(e) {
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

    this.doClick = function(e) {};
};

Canvas.classSelect = function() {
    this.classSelected = 0;

    this.draw = function() {};

    this.checkKeys = function(e) {};

    this.doClick = function(e) {};
};

Canvas.screen = new Canvas.menuScreen();

// The draw loop that draws all game objects on screen
Canvas.draw = function() {
    Canvas.ctx.clearRect(0, 0, 800, 600);
    Canvas.screen.draw();
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

// TODO replace all inner if-statements with a single function
// Callback when any key event occurs during the game
Canvas.checkKeys = function(e) {
    e = e || event; // to deal with IE
    Canvas.screen.checkKeys(e);
};

Canvas.keyType = function(e) {
    Canvas.screen.keyType(e);
};

Canvas.doClick = function(e) {
    Canvas.screen.doClick(e);
};

module.exports = Canvas;
