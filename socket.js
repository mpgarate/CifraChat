// This file is required by app.js. 
// It handles all the socketIO logic for CifraChat.

module.exports = function(app, io)
{
	var chat = io.of('/chat').on('connection', function(clntSocket) {

	  // each client is put into a chat room
	  clntSocket.on('joinRoom', function(room_id)
	  {
		// client may only join room if it's not full
		if (chat.clients(room_id).length >= 2)
		{
			clntSocket.emit('message', { message: 'This room is full.', who: 'Server' });
			clntSocket.disconnect(); // force disconnect
		}
		else
		{
			clntSocket.join(room_id);
	  
			// welcomes client on succesful connection
			clntSocket.emit('message', { message: 'Welcome to  CifraChat.', who: 'Server' });
		  
			// let other user know that client joined
			clntSocket.broadcast.to(room_id).emit('message', 
				{ message: '<b>Other</b> has joined.', who: 'Server' });
		  
		    /** sending **/
			clntSocket.on('send', function (text) {
				// all data sent by client is sent to room
				clntSocket.broadcast.to(room_id).emit('cryptMessage', text);
				// and then simply shown to client
				clntSocket.emit('message', { message: '[sent message]', who: 'Self' });
			});

			/** disconnecting **/
			// notify others that somebody left the chat
			clntSocket.on('disconnect', function() {
				// forward to other user that this chat partner has left
				clntSocket.broadcast.to(this.room).emit('message', { message: '<b>Other</b> has left.' });
			});
		};
	  });
	});	
};