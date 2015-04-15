/**
 * Created by Kostya on 4/13/2015.
 */
var Skill = require("./skill");

function Character(x, y, charClass) {
    this.x = x; this.y = y;
    this.ix = x; this.iy = y;
    this.r = 10;
    this.vel = 0; this.moveDir = 0;
    this.ivel = 115;

    this.combatState = "normal";
    this.revertTimer = 0;

    this.skills = [];
    this.effects = [];

    this.getCharacterPacket = function(name) {
        return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, name: name};
    };

    this.update = function(dt) {

    };
}

module.exports = Character;