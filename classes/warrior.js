/**
 * Created by Kostya on 4/20/2015.
 */
Warrior = {
    maxHealth: 650,
    skillTrackers: [],
    skills: [],
    clientSkills: []
};

Warrior.skillTrackers[0] = function() {
    this.castTime = 1;
    this.cooldown = 1;
    this.curCooldown = 0;

    this.cast = function(x, y, char, aliveSkills) {
        if (char.combatState == "normal" && this.curCooldown <= 0) {
            char.combatState = "casting";
            aliveSkills.push(new Warrior.skills[0](x, y, Math.atan2(-300 + y, -400 + x), this.castTime, "brown", 50, Math.PI / 2));
            this.curCooldown = this.cooldown + this.castTime;
        }
    };

    this.update = function(dt, char) {
        this.curCooldown = Math.max(0, this.curCooldown - dt);
        if (this.curCooldown <= this.cooldown) {
            char.combatState = "normal";
        }
    };

    this.draw = function(ctx) {
        ctx.font = "14px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("LMB: " + parseFloat(Math.round(this.curCooldown * 100) / 100).toFixed(1), 5, 582);
    };
};
Warrior.skills[0] = function(x, y, dir, castTime, color, r, cir) {
    this.state = "casting";
    this.curCastTime = 0;

    this.update = function(dt) {
        switch(this.state) {
            case "casting":
                this.curCastTime = Math.min(castTime, this.curCastTime + dt);
                if (this.curCastTime >= castTime) {
                    //var bDir = Math.atan2(boss.y - this.y, boss.x - this.x);
                    //var bDist = Math.pow(boss.x - this.x, 2) + Math.pow(boss.y - this.y, 2) < Math.pow(this.r + boss.r, 2);
                    //var bAngle = (bDir - this.dir) % (Math.PI * 2);
                    //
                    //if (bDist && bAngle <= this.cir / 2 && bAngle >= this.cir / -2 && castByMe) {
                    //    boss.takeDamage(50, "physical");
                    //    myPlayer.myCharacter.addDamageReductionEffect(this.name, this.effect, this.effectDuration);
                    //}
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
                ctx.fillStyle = color;

                ctx.beginPath();
                ctx.moveTo(400, 300);
                ctx.arc(400, 300, r, dir - (cir / 2), dir + (cir / 2));
                ctx.fill();

                ctx.globalAlpha = .6;
                ctx.beginPath();
                ctx.moveTo(400, 300);
                ctx.arc(400, 300, r * this.curCastTime / castTime, dir - (cir / 2), dir + (cir / 2));
                ctx.fill();

                ctx.globalAlpha = 1;
                break;
            case "dead":
                break;
        }
    };
};

module.exports = Warrior;