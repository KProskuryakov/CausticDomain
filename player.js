/**
 * Created by Kostya on 4/8/2015.
 */
// Represents the human entities in the game
function Player(x, y, num, socket) {
    this.x = x; this.y = y;
    this.ix = x; this.iy = y;
    this.vel = 0; this.moveDir = 0;
    this.ivel = 115;
    this.num = num;
    this.socket = socket;
}

// Server-side for the player to send initial position to new connector
Player.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, num: this.num};
};

// Constructs an update packet that contains the location and velocity of the player
Player.prototype.getMovePacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, num: this.num};
};

// Increments the player's position
Player.prototype.update = function(dt) {
    if (this.vel != 0) {
        var xinc = Math.cos(this.moveDir) * this.vel * dt;
        var yinc = Math.sin(this.moveDir) * this.vel * dt;
        this.x += xinc; this.ix += xinc;
        this.y += yinc; this.iy += yinc;
    }
    if (Math.abs(this.ix - this.x) < 5 && Math.abs(this.iy - this.y) < 5) {
        this.ix = this.x;
        this.iy = this.y;
        console.log(this.ix + " " + this.iy);
    } else {
        var idir = Math.atan2(this.y - this.iy, this.x - this.ix);
        this.ix += Math.cos(idir) * this.ivel * dt;
        this.iy += Math.sin(idir) * this.ivel * dt;
    }
};

// Draws the player on the canvas' context
Player.prototype.draw = function(ctx) {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(this.ix, this.iy, 10, 0, 2 * Math.PI);
    ctx.stroke();
};

module.exports = Player;