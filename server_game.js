/**
 * Created by Kostya on 4/9/2015.
 */
var Game = {};

var Player = require('./player');

Game.players = [];

Game.updatesPerSecond = 60;

Game.update = function () {

};

Game.nameExists = function(name) {
    for (var i = 0; i < Game.players.length; i++) {
        if (Game.players[i].name == name) {
            return true;
        }
    }
    return false;
};

Game.getPlayer = function(name) {
    for (var i = 0; i < Game.players.length; i++) {
        if (Game.players[i].name == name) {
            return Game.players[i];
        }
    }
};

Game.addPlayer = function(name, socket) {
    var player = new Player(0, 0, 10, 100, socket, name);
    Game.players.push(player);
    return player;
};

Game.removePlayer = function(player) {
    var index = Game.players.indexOf(player);
    Game.players.splice(index, 1);
};

module.exports = Game;