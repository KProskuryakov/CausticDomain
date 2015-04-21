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