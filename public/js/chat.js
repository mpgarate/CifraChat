window.onload = function() {
  var messages = [];
  var socket = io.connect('http://localhost:8080');
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");
  var name = document.getElementById("name");
  
  socket.on('message', function (data) {
    if(data.message) {
      messages.push(data);
      var html = '';
      
      console.log("Number of messages: " + messages.length);
      
      for(var i = 0; i < messages.length; i++){
        var decypted_message = decrypt_message(messages[i].message);

        html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
        html += decypted_message + '<br />';
      }

      content.innerHTML = html;
      content.scrollTop = content.scrollHeight;
    } else {
      console.log("There is a problem: ", data);
    }
  });

  // send a message from the data in the form

  function sendMessage(){
    var encrypted_msg = encrypt_message(field.value);
    console.log(encrypted_msg);
    socket.emit('send', {
      username: name.value, message: encrypted_msg
    });
    
    name.value = field.value = ""; // clear fields after sending
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