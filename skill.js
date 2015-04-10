/**
 * Created by Kostya on 4/9/2015.
 */
var Skill = function(x, y, dir, r, cir, castTime, aDamage, eDamage, aHealing, eHealing, color) {
    this.x = x; this.y = y; this.dir = dir; this.r = r; this.cir = cir; this.currentCast = 0;
    this.castTime = castTime; this.aDamage = aDamage; this.eDamage = eDamage; this.aHealing = aHealing;
    this.eHealing = eHealing; this.color = color; this.dead = false;
};

// This is done
Skill.prototype.draw = function(ctx) {
    if (this.dead) {
        return;
    }
    ctx.globalAlpha = .3;
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.r, this.dir - (this.cir / 2), this.dir + (this.cir / 2));
    ctx.fill();

    ctx.globalAlpha = .6;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.r * this.currentCast / this.castTime, this.dir - (this.cir / 2), this.dir + (this.cir / 2));
    ctx.fill();

    ctx.globalAlpha = 1;
};


Skill.prototype.clientUpdate = function(dt, myPlayer, boss) {
    this.currentCast += dt;
    if (this.currentCast > this.castTime) {
        this.dead = true;
        var pDir = Math.atan2(myPlayer.y - this.y, myPlayer.x - this.x);
        var bDir = Math.atan2(boss.y - this.y, boss.x - this.x);
        var pDist = Math.pow(myPlayer.x - this.x, 2) + Math.pow(myPlayer.y - this.y, 2) < Math.pow(this.r + myPlayer.r, 2);
        var bDist = Math.pow(boss.x - this.x, 2) + Math.pow(boss.y - this.y, 2) < Math.pow(this.r + boss.r, 2);

        var pAngle = (pDir - this.dir) % (Math.PI * 2);
        var bAngle = (bDir - this.dir) % (Math.PI * 2);

        console.log(this.cir);

        if (pDist && pAngle <= this.cir / 2 && pAngle >= this.cir / -2) {
            myPlayer.health = Math.max(Math.min(myPlayer.maxHealth, myPlayer.health - this.aDamage + this.aHealing), 0);
        }
        if (bDist && bAngle <= this.cir / 2 && bAngle >= this.cir / -2) {
            boss.health = Math.max(Math.min(boss.maxHealth, boss.health - this.eDamage + this.eHealing), 0);
        }
    }
};

module.exports = Skill;