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

      createCodeEntryHandler();

    } else {
      console.log("There is a problem: ", data);
    }
  });

  function createCodeEntryHandler(){
    $('.apply-message-code').click(function(){
      var parent = $(this).parent();
      var message_tag = parent.find(".message");
      var password = parent.find(".message-code").val();
      var encrypted_msg = parent.data("encmsg");

      var decrypted_msg = decryptMessage(encrypted_msg, password);

      message_tag.html(decrypted_msg);
    });
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
    if (e.keyCode == 13){
      sendMessage();
    }
  }
}