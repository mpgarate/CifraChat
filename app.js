var express = require("express");
var app = express();
var port = 8080;

/* used this http://stackoverflow.com/questions/4529586/
 * to put in ejs (remember to 'npm install ejs') */ 
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// allow access to /public directory
app.use('/public', express.static(__dirname + '/public'));

console.log("Listening on port " + port);

/* this line passes the ExpressJS server to Socket.io */
var io = require('socket.io').listen(app.listen(port));

require('./routes')(app, io);

/* socket io stuff */
io.sockets.on('connection', function (clntSocket) {
  // welcomes on succesful connection
  clntSocket.emit('message', { message: 'Welcome to CifraChat.' });
  
  // all data sent by the user is forwarded to other users
  clntSocket.on('send', function (text) {
    io.sockets.emit('message', text);
  });
});
