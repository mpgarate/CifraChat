// This file is required by app.js. 
// It handles all the server-side socketIO logic for CifraChat, interacting
// with the client-side code in /public/js/chat.js.

module.exports = function(app, io)
{
	var chat = io.of('/chat').on('connection', function(clntSocket)
	{
	  // messages must be numbered to notify each client when their message is decrypted
	  var messageNum = 1; 	  
	
	  // each client is put into a chat room
	  clntSocket.on('joinRoom', function(room_id)
	  {
		// client may only join room only if it's not full
		if (chat.clients(room_id).length >= 2)
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
	  
			// welcome client on succesful connection
			clntSocket.emit('serverMessage', {
				message: 'Welcome to  CifraChat.'
			});
		  
			// let other user know that client joined
			clntSocket.broadcast.to(room_id).emit('serverMessage', {
				message: '<b>Other</b> has joined.'
			});
		  
		    /** sending **/
			clntSocket.on('send', function (text)
			{
				// all data sent by client is sent to room
				clntSocket.broadcast.to(room_id).emit('cryptMessage', {
					message: text.message,
					sender: 'Other',
					number: messageNum
				});
				// and then shown to client
				clntSocket.emit('cryptMessage', {
					message: text.message, 
					sender: 'Self',
					number: messageNum
				});
				
				messageNum++;
			});
		};
			  
		/** disconnect listener **/
		// notify others that somebody left the chat
		clntSocket.on('disconnect', function()
		{
			// let room know that this client has left
			clntSocket.broadcast.to(room_id).emit('serverMessage', {
					message: '<b>Other</b> has left.'
				});
		});
	  }); // end joinRoom listener
	});	
};