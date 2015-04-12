/**
 * Created by Kostya on 4/8/2015.
 */
// Represents the boss entities in the game
var Boss = function (x, y, r, health, maxHealth) {
    this.x = x; this.y = y;
    this.r = r;
    this.health = health;
    this.maxHealth = maxHealth;
};

// Server-side send initial boss values to client
Boss.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, r: this.r, health: this.health, maxHealth: this.maxHealth};
};

// Server-side boss update packet
Boss.prototype.getBossPacket = function() {
    return {x: this.x, y: this.y, health: this.health};
};

Boss.prototype.healthUpdate = function(damage, healing) {
    this.health = Math.max(Math.min(this.maxHealth, this.health - damage + healing), 0);
};

// Draws the boss
Boss.prototype.draw = function(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
};

// Draws the bosses health bar at the top of the screen
Boss.prototype.drawHealth = function(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(60, 20, 680, 30);

    ctx.fillStyle = "green";
    ctx.fillRect(60, 20, 680 * this.health / this.maxHealth, 30);
};

module.exports = Boss;