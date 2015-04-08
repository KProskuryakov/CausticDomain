/**
 * Created by Kostya on 4/8/2015.
 */
var Game = {};

Game.lastUpdate = new Date().getTime();

Game.update = function (myPlayer, otherPlayer) {
    var dt = (new Date().getTime() - Game.lastUpdate) / 1000;

    myPlayer.update(dt);
    otherPlayer.update(dt);

    Game.lastUpdate = new Date().getTime();
};

module.exports = Game;