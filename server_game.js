/**
 * Created by Kostya on 4/9/2015.
 */
var Game = {};

Game.Player = require('./player');
Game.Boss = require('./boss');
Game.Skill = require('./skill');

Game.players = [];
Game.boss = new Game.Boss(400, 300, 50, 1000, 1000);

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
    var player = new Game.Player(0, 0, 10, 100, socket, name, Game);
    Game.players.push(player);
    return player;
};

Game.removePlayer = function(player) {
    var index = Game.players.indexOf(player);
    Game.players.splice(index, 1);
};

module.exports = Game;