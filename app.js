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


var Game = require("./server_game.js");


io.on('connection', function (socket) {
    var state = "connected";
    var player = null;

    socket.on('login', function(data) {
        if (Game.nameExists(data.name)) {
            socket.emit('loginFailed');
        } else {
            state = "loggedIn";
            var playerData = [];
            for (var i = 0; i < Game.players.length; i++) {
                playerData.push(Game.players[i].getStartPacket());
            }
            player = Game.addPlayer(data.name, socket);
            socket.emit('loginSuccess', {playerData: playerData,
                player: player.getStartPacket(), bossData: Game.boss.getStartPacket()});
            socket.broadcast.emit('playerConnected', player.getStartPacket());
        }
    });

    socket.on('disconnect', function() {
        if (state == "loggedIn") {
            socket.broadcast.emit('playerDisconnected', {name: player.name});
            Game.removePlayer(player);
        }
    });

    socket.on('moveChange', function(data) {
        socket.broadcast.emit('moveChange', data);
        player.x = data.x;
        player.y = data.y;
        player.vel = data.vel;
        player.moveDir = data.moveDir;
    });

    socket.on('bossUpdate', function(data) {
        socket.broadcast.emit('bossUpdate', data);
        Game.boss.healthUpdate(data.damage, data.healing);
    });
});