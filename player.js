/**
 * Created by Kostya on 4/8/2015.
 */
// Represents the human entities in the game
function Player(x, y, num) {
    this.x = x; this.y = y;
    this.ix = x; this.iy = y;
    this.vel = 0; this.moveDir = 0;
    this.ivel = 0; this.idir = 0;
    this.num = num;
}

// Constructs an update packet that contains the location and velocity of the player
Player.prototype.getMovePacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, num: this.num};
};

// Increments the player's position
Player.prototype.update = function(dt) {
    if (this.vel != 0) {
        this.x += Math.cos(this.moveDir) * this.vel * dt;
        this.y += Math.sin(this.moveDir) * this.vel * dt;
    }
};

// Draws the player on the canvas' context
Player.prototype.draw = function(ctx) {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
};

module.exports = Player;