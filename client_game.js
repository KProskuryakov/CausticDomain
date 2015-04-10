/**
 * Created by Kostya on 4/8/2015.
 */
var Game = {};

// The time value of the last dt update
Game.lastUpdate = new Date().getTime();

Game.skillsAlive = [];

// The update loop that iterates through all game objects
Game.update = function (myPlayer, otherPlayer, boss) {
    var dt = (new Date().getTime() - Game.lastUpdate) / 1000;

    myPlayer.update(dt);
    otherPlayer.update(dt);

    for (var i = 0; i < Game.skillsAlive.length; i++) {
        var cur = Game.skillsAlive[i];
        if (cur.dead) {
            Game.skillsAlive.splice(i, 1);
            i--;
        } else {
            cur.clientUpdate(dt, myPlayer, boss);
        }
    }

    Game.lastUpdate = new Date().getTime();
};

Game.cast = function(x, y, posX, posY) {
    var sDir = Math.atan2(posY - y, posX - x);

    Game.skillsAlive.push(new Game.Skill(x, y, sDir, 60, Math.PI / 2, 2.5, 0, 25, 0, 0, "brown"));
};

module.exports = Game;