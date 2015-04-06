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
    this.num = num;
    this.socket = socket;
};

var player1 = null;
var player2 = null;



var Game = {};

Game.updatesPerSecond = 20;

Game.update = function () {
    if (player1 != null && player2 != null) {
        player1.socket.emit('update', {x: player2.x, y: player2.y, num: 1});
        player2.socket.emit('update', {x: player1.x, y: player1.y, num: 2});
    }
};

setInterval(Game.update, 1000 / Game.updatesPerSecond);



io.on('connection', function (socket) {
    console.log("New connection on port 8080.");
    if (player1 == null) {
        player1 = new Player(0, 0, 1);
        player1.socket = socket;
        socket.emit("start", {num: 1});
    } else if (player2 == null) {
        player2 = new Player(0, 0, 2);
        player2.socket = socket;
        socket.emit("start", {num: 2});
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
});