window.onload = function() {
  var messages = [];
  var socket = io.connect('http://localhost:8080');
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");
  var passwordField = document.getElementById("password");
  
  socket.on('message', function (data) {
    if(data.message) {
      messages.push(data);
      var html = '';
      
      console.log("Number of messages: " + messages.length);
      
      for(var i = 0; i < messages.length; i++){
        var m = messages[i].message;
        html += '<div class="message-wrapper" data-encmsg="' + m + '">';
        html += '<b>' + 'Other' + ': </b>';
        html += '<input class="input-box message-code">';
        html += '<input type="button" class="apply-message-code" value="apply"><br />';
        html += '<p class="message message-' + i + '">';
        html += m + '</p></div><br />';
      }

      content.innerHTML = html;
      content.scrollTop = content.scrollHeight;

      // set click + enter key handlers for applying code to messages in chat window
      createCodeEntryHandlers();

    } else {
      console.log("There is a problem: ", data);
    }
  });

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

    console.log(applyButtons)

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

  // button click and enter key press handlers for form

  sendButton.onclick = function(){
    sendMessage();
  };
  
  field.onkeypress = function(e){
    // if enter key
    if (e.keyCode == 13){
      sendMessage();
    }
  }
}