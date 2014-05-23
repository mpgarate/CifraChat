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
        html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
        html += messages[i].message + '<br />';
      }

      content.innerHTML = html;
      content.scrollTop = content.scrollHeight;
    } else {
      console.log("There is a problem: ", data);
    }
  });

  sendButton.onclick = function(){
    socket.emit('send', {
      username: name.value, message: field.value
    });
    
    name.value = field.value = ""; // clear fields after sending
  };
}