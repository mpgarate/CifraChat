var port = 8080;

// set up Express and SocketIO
var express = require('express');
var io = require('socket.io');
var app = express();
var server = require('http').createServer(app);
io = io.listen(server);
server.listen(port);

app.set('views', __dirname + '/views');

// allow access to /public directories
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

console.log("Listening on port " + port);

// linking
require('./routes')(app, io); // sets up endpoints
require('./socket')(app, io); // socketIO logic