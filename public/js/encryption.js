'use strict';
function encryptMessage(message,password){
  if (password === ''){
    return message;
  }

  var encrypted = CryptoJS.AES.encrypt(message, password);
  return encrypted.toString();
}

function decryptMessage(message,password){
  var decrypted = CryptoJS.AES.decrypt(message, password);
  return decrypted.toString(CryptoJS.enc.Utf8);
}
