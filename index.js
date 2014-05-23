var express = require("express");
var app = express();
var port = 8080;
 
/* used this http://stackoverflow.com/questions/4529586/
 * to put in ejs (remember to 'npm install ejs') */ 
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.get("/", function(req, res){
    res.render("index.ejs");
});

// allow access to /public directory
app.use('/public', express.static(__dirname + '/public'));

console.log("Listening on port " + port);

/* this line passes the ExpressJS server to Socket.io */
var io = require('socket.io').listen(app.listen(port));

/* socket io stuff */
io.sockets.on('connection', function (socket) {
    // socket object == client socket
	
	// welcomes on succesful connection
	socket.emit('message', { message: 'welcome to the chat' });
	
	// all data sent by the user is forwarded to other users
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});