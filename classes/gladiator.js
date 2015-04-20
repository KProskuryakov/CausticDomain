/**
 * Created by Kostya on 4/16/2015.
 */
Gladiator = {
    maxHealth: 650,
    skills: [],
    skillTrackers: []
};

Gladiator.skills[0] = function(x, y, dir, castTime) {
    this.name = "Guarding Strike";
    this.effect = .8;
    this.effectDuration = 5;
    this.color = "brown";

    this.r = 50;
    this.cir = 90;

    this.state = "casting";
    this.castTime = castTime;
    this.startTime = Date.now();

    this.x = x;
    this.y = y;
    this.dir = dir;

    this.update = function(myPlayer, boss, castByMe) {
        switch(this.state) {
            case "casting":
                if (Date.now() > this.startTime + this.castTime) {
                    var bDir = Math.atan2(boss.y - this.y, boss.x - this.x);
                    var bDist = Math.pow(boss.x - this.x, 2) + Math.pow(boss.y - this.y, 2) < Math.pow(this.r + boss.r, 2);
                    var bAngle = (bDir - this.dir) % (Math.PI * 2);

                    if (bDist && bAngle <= this.cir / 2 && bAngle >= this.cir / -2 && castByMe) {
                        boss.takeDamage(50, "physical");
                        myPlayer.myCharacter.addDamageReductionEffect(this.name, this.effect, this.effectDuration);
                    }
                    this.state = "dead";
                }
                break;
            case "dead":
                break;
        }
    };
    this.draw = function(ctx) {
        switch(this.state) {
            case "casting":
                ctx.globalAlpha = .3;
                ctx.fillStyle = this.color;

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.arc(this.x, this.y, this.r, this.dir - (this.cir / 2), this.dir + (this.cir / 2));
                ctx.fill();

                ctx.globalAlpha = .6;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.arc(this.x, this.y, this.r * (this.startTime - Date.now()) / this.castTime, this.dir - (this.cir / 2), this.dir + (this.cir / 2));
                ctx.fill();

                ctx.globalAlpha = 1;
                break;
            case "dead":
                break;
        }
    };
};

Gladiator.skillTrackers[0] = function() {
    this.castTime = 1000;

    this.cast = function(myCharacter, mySkills, x, y, mouseX, mouseY) {
        if (myCharacter.combatState == "normal") {
            myCharacter.combatState = "casting";
            mySkills.push(new Gladiator.skills[0](x, y, Math.atan2(mouseY - y, mouseX - x), this.castTime));
            myCharacter.startedCasting = Date.now();
            myCharacter.castTime = this.castTime;
        }
    };

    this.draw = function(ctx) {
        // TODO Implement skilltracker draw methods
    };
};

Gladiator.skills[1] = function(x, y, dir, castTime) {};

module.exports = Gladiator;