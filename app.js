var port = Number(8888);

// set up Express and SocketIO
var express = require('express');
var io = require('socket.io');

var app = express();
var server = require('http').createServer(app);
io = io.listen(server, { log: false });
server.listen(port);

app.enable('trust proxy');
app.set('views', __dirname + '/views');

// allow access to /public directories
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/inc', express.static(__dirname + '/public/inc'));
app.use('/partials', express.static(__dirname + '/public/partials'));
app.use('/img', express.static(__dirname + '/public/img'));

console.log("Listening on port " + port);

// linking
require('./socket')(app, io); // socketIO logic
require('./routes')(app, io); // sets up endpoints
