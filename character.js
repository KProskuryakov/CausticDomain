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
    this.startedCasting = 0;
    this.castTime = 0;

    this.damageReductionEffects = [];

    this.skillTrackers = [];
    for (var i = 0; i < charClass.skillTrackers.length; i++) {
        this.skillTrackers.push(new charClass.skillTrackers[i]());
    }


    this.getCharacterPacket = function(name) {
        return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, name: name};
    };

    this.update = function(dt) {

    };

    this.takeDamage = function(damage, type) {

    };

    this.takeHealing = function(healing) {

    };

    this.addDamageReductionEffect = function(name, reduction, duration) {
        for (var i = 0; i < this.damageReductionEffects.length; i++) {
            if (name == this.damageReductionEffects[i].name) {
                this.damageReductionEffects[i].duration = duration;
                return;
            }
        }
        this.damageReductionEffects.push({name: name, reduction: reduction, duration: duration, startTime: Date.now()});
    };
}

module.exports = Character;