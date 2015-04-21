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

var players = [];

io.on('connection', function (socket) {
    var player = {state: "connected", socket: socket};

    socket.on('login', function(data) {
        if (nameExists(data.name)) {
            socket.emit('loginFailed');
        } else {
            player.state = "selectingClass";
            var playerData = [];
            for (var i = 0; i < players.length; i++) {
                playerData.push({name: players[i].name, classSelected: players[i].classSelected, ready: players[i].ready});
            }
            player.name = data.name; player.socket = socket; player.classSelected = "Warrior"; player.ready = false;
            socket.emit('loginSuccess', {playerData: playerData});
            socket.broadcast.emit('playerConnected', {name: player.name, classSelected: "Warrior", ready: false});
            players.push(player);
        }
    });

    socket.on('disconnect', function() {
        if (player.state != "connected") {
            socket.broadcast.emit('playerDisconnected', {name: player.name});
            removePlayer(player);
        }
    });

    socket.on('classChange', function(data) {
        player.classSelected = data.classSelected;
        socket.broadcast.emit('classChange', {name: player.name, classSelected: data.classSelected});
    });

    socket.on('readyChange', function(data) {
        player.ready = data.ready;
        socket.broadcast.emit('readyChange', {name: player.name, ready: player.ready});
        for (var i = 0; i < players.length; i++) {
            if (!players[i].ready) {
                return;
            }
        }
        for (i = 0; i < players.length; i++) {
            players[i].socket.emit('allReady', {x: i*20});
        }
    });

    socket.on('moveChange', function(data) {
        socket.broadcast.emit('moveChange', data);
        player.x = data.x;
        player.y = data.y;
        player.velX = data.velX;
        player.velY = data.velY;
    });

    //socket.on('bossUpdate', function(data) {
    //    socket.broadcast.emit('bossUpdate', data);
    //    Game.boss.healthUpdate(data.damage, data.healing);
    //});
});

function nameExists(name) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].name == name) {
            return true;
        }
    }
    return false;
}

//function getPlayer(name) {
//    for (var i = 0; i < Game.players.length; i++) {
//        if (Game.players[i].name == name) {
//            return Game.players[i];
//        }
//    }
//}
//
//function addPlayer(name, socket, classSelected) {
//    var player = {name: name, socket: socket, classSelected: classSelected};
//    Game.
//    return player;
//}

function removePlayer(player) {
    var index = players.indexOf(player);
    players.splice(index, 1);
}
