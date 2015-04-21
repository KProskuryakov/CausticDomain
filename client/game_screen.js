/**
 * Created by Kostya on 4/20/2015.
 */
var GameScreen = function(socket, ctx, name, classSelected, players) {

    this.update = function() {};

    this.draw = function() {
        ctx.clearRect(0, 0, 800, 600);
        ctx.fillText("Wee!", 300, 200);
    };

    this.checkKeys = function(e) {};

    this.doClick = function(e) {};

    this.mouseMove = function(e) {};

    function bind() {}
    function unbind() {}

    bind();
};

module.exports = GameScreen;