
module.exports = function(app,io){

	io.sockets.on('connection', function(clntSocket) {
	  
	  // rejects connection if 2 users already present
	  if(io.sockets.clients().length <= 2) {
		// welcomes on succesful connection
		clntSocket.emit('message', { message: 'Welcome to  CifraChat.' });
	  
		// let current user know when new user joins
		io.sockets.on('connection', function() {
		  clntSocket.emit('message', { message: '<b>Other</b> has joined.' });
		});
	  
		// all data sent by the user is forwarded to other users
		clntSocket.on('send', function (text) {
		  io.sockets.emit('message', text);
		});

		// notify Self that somebody left the chat
		clntSocket.on('disconnect', function() {
			// forward to other user that this chat partner has left
			io.sockets.emit('message', { message: '<b>Other</b> has left.' });
		});
	  }
	  else {
		clntSocket.emit('message', { message: 'This room is full.' });
		clntSocket.disconnect(); // force disconnect
	  };
	});
};