/**
 * Created by Kostya on 4/8/2015.
 */
var Game = {};

Game.Player = require("./player.js");
Game.Boss = require("./boss.js");
Game.Skill = require("./skill.js");

Game.state = "notLoggedIn"; // Possible states: notLoggedIn, loggedIn


// The time value of the last dt update
Game.lastUpdate = new Date().getTime();

Game.myPlayer = null;
Game.players = [];

Game.skillsAlive = [];

Game.initMyPlayer = function(packet, socket) {
    Game.myPlayer = new Game.Player(packet.x, packet.y, 10, 100, socket, packet.name);
};

Game.initPlayers = function(playerData) {
    for (var i = 0; i < playerData.length; i++) {
        Game.players.push(new Player(playerData[i].x, playerData[i].y, 10, 100, null, playerData[i].name));
        Game.players[i].vel = playerData[i].vel;
        Game.players[i].moveDir = playerData[i].moveDir;
    }
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
    }

    //for (var i = 0; i < Game.skillsAlive.length; i++) {
    //    var cur = Game.skillsAlive[i];
    //    if (cur.dead) {
    //        Game.skillsAlive.splice(i, 1);
    //        i--;
    //    } else {
    //        cur.clientUpdate(dt, myPlayer, boss); // TODO fix skill update code
    //    }
    //}

    Game.lastUpdate = new Date().getTime();
};

Game.cast = function(x, y, posX, posY) {
    var sDir = Math.atan2(posY - y, posX - x);

    Game.skillsAlive.push(new Game.Skill(x, y, sDir, 60, Math.PI / 2, 2.5, 0, 25, 0, 0, "brown"));
};

module.exports = Game;