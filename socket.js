// This file is required by app.js. 
// It handles all the server-side socketIO logic for CifraChat, interacting
// with the client-side code in /public/js/chat.js.

// discussion: https://github.com/Automattic/socket.io/issues/1450
var roomCount = function(room)
{
	var localCount = 0;
	if (room)
		for (var id in room)
			localCount ++;
	return localCount;
}

// messages must be numbered to notify each client when their message is decrypted
var messageNum = 1;	
var MAX_ALLOWED_CLIENTS = 2;

module.exports = function(app, io)
{
	var chat = io.of('/chat').on('connection', function(clntSocket)
	{		  
	  // each client is put into a chat room restricted to max 2 clients
	  clntSocket.on('joinRoom', function(room_id)
	  {
	  	var clients_in_room = roomCount(chat.adapter.rooms[room_id]);
		// client may only join room only if it's not full
		if (clients_in_room >= MAX_ALLOWED_CLIENTS)
		{
			clntSocket.emit('serverMessage', {
				message: 'This room is full.'
			});
			// force client to disconnect
			clntSocket.disconnect();
		}
		else
		{
			// client joins room specified in URL
			clntSocket.join(room_id);

			clients_in_room++;
	  
			// welcome client on succesful connection
			clntSocket.emit('serverMessage', {
				message: 'Welcome to  CifraChat.'
			});
		  
			// let other user know that client joined
			clntSocket.broadcast.to(room_id).emit('serverMessage', {
				message: '<b>Other</b> has joined.'
			});	
			
			if (clients_in_room == MAX_ALLOWED_CLIENTS){
				// let everyone know that the max amount of users (2) has been reached
				chat.in(room_id).emit('serverMessage', {
					message: 'This room is now full -- there are <b>2</b> users present. No more users can join.'
				});
			}
		  
		    /** sending encrypted **/
			clntSocket.on('cryptSend', function (data) {
				// all data sent by client is sent to room
				clntSocket.broadcast.to(room_id).emit('cryptMessage', {
					message: data.message,
					hint: data.hint,
					sender: 'Other',
					number: messageNum
				});
				// and then shown to client
				clntSocket.emit('cryptMessage', {
					message: data.message, 
					hint: data.hint,
					sender: 'Self',
					number: messageNum
				});
				
				messageNum++;
			});
			
			/** sending unencrypted **/
			clntSocket.on('noncryptSend', function (text) {
				// all data sent by client is sent to room
				clntSocket.broadcast.to(room_id).emit('noncryptMessage', {
					message: text.message,
					sender: 'Other'
				});
				// and then shown to client
				clntSocket.emit('noncryptMessage', {
					message: text.message, 
					sender: 'Self'
				});
				
				// unencrypted messages don't increment messageNum because messageNum is only used to identify which message was decrypted
			});
			
			/** notifying clients of decryption **/
			clntSocket.on('confirmDecrypt', function(id) {
				// let room know which particular message was decrypted
				chat.in(room_id).emit('markDecryption', id);
			});

			clntSocket.on('confirmMessageDestroy', function(id) {
				chat.in(room_id).emit('markMessageDestroy', id)
			});
		};
			  
		/** disconnect listener **/
		// notify others that somebody left the chat
		clntSocket.on('disconnect', function() {
			// let room know that this client has left
			clntSocket.broadcast.to(room_id).emit('serverMessage', {
					message: '<b>Other</b> has left.'
				});
		});
	  }); // end joinRoom listener
	});	
};
