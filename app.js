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

app.get('/bundle.js', function (req, res) {
    res.sendFile(__dirname + '/bundle.js');
});

var Player = require("./player.js");
var Boss = require("./boss.js");
var Game = require("./server_game.js");


var player1 = null;
var player2 = null;

var boss = new Boss(400, 300, 50, 1000);



//setInterval(Game.update, 1000 / Game.updatesPerSecond);



io.on('connection', function (socket) {
    console.log("New connection on port 8080.");
    if (player1 == null) {
        player1 = new Player(0, 0, 10, 1, socket);
        socket.emit("start", {num: 1, boss: boss.getStartPacket()});
    } else if (player2 == null) {
        player2 = new Player(0, 0, 10, 2, socket);
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
            if (player2 != null) {
                player2.socket.emit('moveChange', data);
            }
            player1.x = data.x;
            player1.y = data.y;
            player1.vel = data.vel;
            player1.moveDir = data.moveDir;
        } else if (data.num == 2) {
            if (player1 != null) {
                player1.socket.emit('moveChange', data);
            }
            player2.x = data.x;
            player2.y = data.y;
            player2.vel = data.vel;
            player2.moveDir = data.moveDir;
        }
    })
});