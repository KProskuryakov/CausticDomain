/**
 * Created by Kostya on 4/5/2015.
 */
app = require('express')();
server = require('http').Server(app);
io = require('socket.io')(server);

server.listen(8080);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



var Player = function(x, y, num, socket) {
    this.x = x; this.y = y;
    this.vel = 0; this.moveDir = 0;
    this.num = num;
    this.socket = socket;
};

Player.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, num: this.num};
}

Player.prototype.getMovePacket = function() {
    return {x: this.x, y: this.y, vel: this.vel, moveDir: this.moveDir, num: this.num};
};


var Boss = function (x, y, health) {
    this.x = x; this.y = y;
    this.health = health;
};

Boss.prototype.getStartPacket = function() {
    return {x: this.x, y: this.y, health: this.health};
}

Boss.prototype.getBossPacket = function(){
    return {x: this.x, y: this.y, health: this.health};
};


var player1 = null;
var player2 = null;

var boss = new Boss(400, 300, 1000);



var Game = {};

Game.updatesPerSecond = 60;

Game.update = function () {

};

setInterval(Game.update, 1000 / Game.updatesPerSecond);



io.on('connection', function (socket) {
    console.log("New connection on port 8080.");
    if (player1 == null) {
        player1 = new Player(0, 0, 1, socket);
        socket.emit("start", {num: 1, boss: boss.getStartPacket()});
    } else if (player2 == null) {
        player2 = new Player(0, 0, 2, socket);
        socket.emit("start", {num: 2, boss: boss.getStartPacket(), player: player1.getStartPacket()});
    }

    socket.on('update', function(data) {
        console.log("Update!");
        if (data.num == 1) {
            player1.x = data.x;
            player1.y = data.y;
        } else if (data.num == 2) {
            player2.x = data.x;
            player2.y = data.y;
        }
    });

    socket.on('moveChange', function(data) {
        if (data.num == 1) {
            player1.x = data.x;
            player1.y = data.y;
            player1.vel = data.vel;
            player1.moveDir = data.moveDir;
            if (player2 != null) {
                player2.socket.emit('moveChange', player1.getMovePacket());
            }
        } else if (data.num == 2) {
            player2.x = data.x;
            player2.y = data.y;
            player2.vel = data.vel;
            player2.moveDir = data.moveDir;
            if (player1 != null) {
                player1.socket.emit('moveChange', player2.getMovePacket());
            }
        }
    })
});