var express = require("express");
var app = express();
var port = 8080;

/* used this http://stackoverflow.com/questions/4529586/
 * to put in ejs (remember to 'npm install ejs') */ 
app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);

// allow access to /public directories
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/lib', express.static(__dirname + '/public/lib'));
app.use('/partials', express.static(__dirname + '/public/partials'));

// redirect root to index
app.all("/", function(req, res, next) {
  res.sendfile("index.html", { root: __dirname + "/public" });
});

// redirect all other paths to chat
app.all("/*", function(req, res, next) {
  res.sendfile("chat.html", { root: __dirname + "/public" });
});

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
