// This script is called when a chat room loads.
// It handles all the client-side socketIO logic for CifraChat, interacting
// with the server-side code in socket.js.

window.onload = function() {
  var messages = [];
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");
  var passwordField = document.getElementById("password");

  // get chat room ID from URL
  var room_id = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);

  // connect to socket
  var socket = io.connect('/chat');

  // send ID to server on connect
  socket.on('connect', function(){
	socket.emit('joinRoom', room_id);
  });
  
  // handle unencrypted message
  socket.on('message', function (data) {
    render_message_partial('/partials/message.ejs', data);
  });
  
  // handle encrypted message
  socket.on('cryptMessage', function (data) {
    render_message_partial('/partials/cryptMessage.ejs', data);
    createCodeEntryHandlers();
  });

  function render_message_partial(path,data){
    if(data.message) {
      var html = content.innerHTML;
      
      html += new EJS({url: path}).render(data);

      content.innerHTML = html;
      content.scrollTop = content.scrollHeight;

    } else {
      console.log("There is a problem: ", data);
    }
  }

  function applyCode(parent){
    var message_tag = parent.getElementsByClassName("message").item(0);
    var password = parent.getElementsByClassName("message-code").item(0).value;
    var encrypted_msg = parent.dataset.encmsg;
    var decrypted_msg = decryptMessage(encrypted_msg, password);

    message_tag.innerHTML = decrypted_msg;
  }

  function createCodeEntryHandlers(){

    var applyButtons = document.getElementsByClassName('apply-message-code');
    var messageCodes = document.getElementsByClassName('message-code');

    for (var i = 0; i < applyButtons.length; i++){
      applyButtons.item(i).onclick = function(){
        applyCode(this.parentNode);
      };
    }

    for (var i = 0; i < messageCodes.length; i++){
      messageCodes.item(i).onkeypress = function(e){
        // if enter key
        if (e.keyCode == 13){
          applyCode(this.parentNode);
        }
      };
    }
  }

  // send a message from the data in the form

  function sendMessage(){
    var message = field.value;
    var password = passwordField.value;
    
    var encrypted_msg = encryptMessage(message,password);

    socket.emit('send', {
      message: encrypted_msg
    });
    
    field.value = ""; // clear message field after sending
  }

  /** send button click listener for sending a message **/
  sendButton.onclick = function(){
    sendMessage();
  };
  
  /** enter key listener for sending a message **/
  field.onkeypress = function(e){
    // if enter key
    if (e.keyCode == 13){
      sendMessage();
    }
  }
}