/**
 * Created by Kostya on 4/8/2015.
 */
// Represents the human entities in the game
function Player(socket, name) {
    this.socket = socket;
    this.name = name;
    this.myCharacter = null;
}

// Server-side for the player to send initial position to new connector
Player.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, name: this.name};
};

// Constructs an update packet that contains the location and velocity of the player
Player.prototype.getMovePacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, name: this.name};
};

Player.prototype.copySkill = function(id, dir) {
    var original = this.skills[id];
    return new this.Game.Skill(this.x, this.y, dir, original.r, original.cir, original.castTime, original.aDamage, original.eDamage, original.aHealing, original.eHealing, original.color);
};

Player.prototype.cast = function(Game, id, posX, posY) {
    if (this.combatState == "normal") {
        var sDir = Math.atan2(posY - this.y, posX - this.x);
        var skill = this.copySkill(id, sDir);
        this.combatState = "casting";
        this.revertTimer = skill.castTime;
        if (this.vel != 0) {
            this.vel = 0;
            this.socket.emit("moveChange", this.getMovePacket());
        }
        Game.skillsAlive.push(skill);
    }
};

// Increments the player's position
Player.prototype.update = function(dt) {
    if (this.combatState != "normal") {
        this.revertTimer -= dt;
        if (this.revertTimer < 0) {
            this.combatState = "normal";
            this.Game.Canvas.screen.resetKeyEvent();
        } else {
            return;
        }
    }
    if (this.vel != 0) {
        var xinc = Math.cos(this.moveDir) * this.vel * dt;
        var yinc = Math.sin(this.moveDir) * this.vel * dt;
        this.x += xinc; this.ix += xinc;
        this.y += yinc; this.iy += yinc;
    }
    if (Math.abs(this.ix - this.x) < 5 && Math.abs(this.iy - this.y) < 5) {
        this.ix = this.x;
        this.iy = this.y;
    } else {
        var idir = Math.atan2(this.y - this.iy, this.x - this.ix);
        this.ix += Math.cos(idir) * this.ivel * dt;
        this.iy += Math.sin(idir) * this.ivel * dt;
    }
};

// Draws the player on the canvas' context
Player.prototype.draw = function(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.ix, this.iy, this.r, 0, 2 * Math.PI);
    ctx.fill();
};

module.exports = Player;