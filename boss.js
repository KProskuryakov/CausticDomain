/**
 * Created by Kostya on 4/8/2015.
 */
// Represents the boss entities in the game
var Boss = function (x, y, health) {
    this.x = x; this.y = y;
    this.health = health;
    this.maxHealth = health;
};

// Server-side send initial boss values to client
Boss.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, health: this.health, maxHealth: this.maxHealth};
};

// Server-side boss update packet
Boss.prototype.getBossPacket = function(){
    return {x: this.x, y: this.y, health: this.health};
};

// Draws the boss
Boss.prototype.draw = function(ctx) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI);
    ctx.stroke();
};

// Draws the bosses health bar at the top of the screen
Boss.prototype.drawHealth = function(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(60, 20, 680, 30);

    ctx.fillStyle = "green";
    ctx.fillRect(60, 20, 680 * this.health / this.maxHealth, 30);
};

module.exports = Boss;