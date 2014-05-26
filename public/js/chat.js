// This script is called when a chat room loads.
// It handles all the client-side socketIO logic for CifraChat, interacting
// with the server-side code in socket.js.

window.onload = function() {
  var messages = [];
  var messageField = document.getElementById("messageField");
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
  var messageTemplate = new EJS({url: '/partials/message.ejs'})
  socket.on('message', function (data) {
    renderMessagePartial(messageTemplate, data);
  });
  
  // handle encrypted message
  var cryptMessageTemplate = new EJS({url: '/partials/cryptMessage.ejs'})
  socket.on('cryptMessage', function (data) {
    renderMessagePartial(cryptMessageTemplate, data);
    createCodeEntryHandlers();
  });

  function renderMessagePartial(ejsTemplate,data){
    if(data.message) {
      var html = content.innerHTML;
      
      html += ejsTemplate.render(data);

      content.innerHTML = html;
      content.scrollTop = content.scrollHeight;

    } else {
      console.log("There is a problem: ", data);
    }
  }

  function applyCode(parent){
    var messageTag = parent.find(".message");
    var password = parent.find(".message-code").val();
    var encryptedMsg = parent.data("encmsg");
    var decryptedMsg = decryptMessage(encryptedMsg, password);

    messageTag.html(decryptedMsg);
  }

  function createCodeEntryHandlers(){
    $(".apply-message-code").click(function(){
      var messageWrapper = $(this).parents(".message-wrapper");
      applyCode(messageWrapper);
    });

    $(".message-code").keypress(function(e){
      // if enter key
      if (e.keyCode == 13){
        var messageWrapper = $(this).parents(".message-wrapper");
        applyCode(messageWrapper);
      }
    });
  }

  // send a message from the data in the form

  function sendMessage(){
    var message = messageField.value;
    var password = passwordField.value;
    
    var encryptedMsg = encryptMessage(message,password);

    socket.emit('send', {
      message: encryptedMsg
    });
    
    messageField.value = ""; // clear message field after sending
  }

  /** send button click listener for sending a message **/
  sendButton.onclick = function(){
    sendMessage();
  };
  

  /** enter key listeners for sending a message **/
  messageField.onkeypress = function(e){
    // if enter key
    if (e.keyCode == 13){
      sendMessage();
    }
  }
  passwordField.onkeypress = function(e){
    // if enter key
    if (e.keyCode == 13){
      sendMessage();
    }
  }
}