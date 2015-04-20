/**
 * Created by Kostya on 4/8/2015.
 */
var Game = {};

var Player = require("./../player");
var Boss = require("./../boss");
var Skill = require("./../skill");

Game.state = "notLoggedIn"; // Possible states: notLoggedIn, loggedIn


// The time value of the last dt update
Game.lastUpdate = new Date().getTime();

Game.myPlayer = null;
Game.players = [];
Game.boss = null;

Game.mySkills = [];
Game.otherSkills = [];

Game.initMyPlayer = function(packet, socket) {
    Game.myPlayer = new Player(packet.x, packet.y, 10, 100, socket, packet.name, Game);
};


Game.initPlayer = function (packet) {
    var newPlayer = new Player(packet.x, packet.y, 10, 100, null, packet.name, Game);
    newPlayer.vel = packet.vel;
    newPlayer.moveDir = packet.moveDir;
    Game.players.push(newPlayer);
};

Game.initPlayers = function(playerData) {
    for (var i = 0; i < playerData.length; i++) {
        Game.initPlayer(playerData[i]);
    }
};

Game.initBoss = function(boss) {
    Game.boss = new Boss(boss.x, boss.y, boss.r, boss.health, boss.maxHealth);
};

Game.moveChange = function(data) {
    if (Game.state == "loggedIn") {
        var player = Game.getPlayer(data.name);
        player.x = data.x;
        player.y = data.y;
        player.vel = data.vel;
        player.moveDir = data.moveDir;
    }
};

Game.removePlayer = function(name) {
    for (var i = 0; i < Game.players.length; i++) {
        if (Game.players[i].name == name) {
            Game.players.splice(i, 1);
        }
    }
};

Game.getPlayer = function(name) {
    for (var i = 0; i < Game.players.length; i++) {
        if (Game.players[i].name == name) {
            return Game.players[i];
        }
    }
};

Game.changeState = function(newState) {
    switch(newState) {
        case "loggedIn":
            Game.state = newState;
            Game.Canvas.screen = new Game.Canvas.gameScreen();
            break;
    }
};

// The update loop that iterates through all game objects
Game.update = function () {
    var dt = (new Date().getTime() - Game.lastUpdate) / 1000;

    if (Game.state == "loggedIn") {
        Game.myPlayer.update(dt);
        for (var i = 0; i < Game.players.length; i++) {
            Game.players[i].update(dt);
        }
        for (i = 0; i < Game.skillsAlive.length; i++) {
            var cur = Game.skillsAlive[i];
            if (cur.dead) {
                Game.skillsAlive.splice(i, 1);
                i--;
            } else {
                cur.clientUpdate(dt, Game.myPlayer, Game.boss);
            }
        }
    }

    Game.lastUpdate = new Date().getTime();
};

module.exports = Game;