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


module.exports = Game;