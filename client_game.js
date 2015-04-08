/**
 * Created by Kostya on 4/8/2015.
 */
var Game = {};

// The time value of the last dt update
Game.lastUpdate = new Date().getTime();

// The update loop that iterates through all game objects
Game.update = function (myPlayer, otherPlayer) {
    var dt = (new Date().getTime() - Game.lastUpdate) / 1000;

    myPlayer.update(dt);
    otherPlayer.update(dt);

    Game.lastUpdate = new Date().getTime();
};

module.exports = Game;