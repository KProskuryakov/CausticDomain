/**
 * Created by Kostya on 4/9/2015.
 */
var Skill = function(x, y, dir, r, cir, castTime, aDamage, eDamage, aHealing, eHealing, color) {
    this.x = x; this.y = y; this.dir = dir; this.r = r; this.cir = cir; this.currentCast = 0;
    this.castTime = castTime; this.aDamage = aDamage; this.eDamage = eDamage; this.aHealing = aHealing;
    this.eHealing = eHealing; this.color = color; this.dead = false;
};

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

Skill.prototype.update = function(dt) {
    this.currentCast += dt;
    if (this.currentCast > this.castTime) {
        this.dead = true;
    }
};

module.exports = Skill;