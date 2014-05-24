function encrypt_message(message,password){
  if (typeof password === 'undefined'){
    password = "tRe_haxucr6hej8s";
  }

  var encrypted = CryptoJS.AES.encrypt(message, password);
  return encrypted.toString();
}

function decrypt_message(message,password){
  if (typeof password === 'undefined'){
    password = "tRe_haxucr6hej8s";
  }

  var decrypted = CryptoJS.AES.decrypt(message, password);
  return decrypted.toString(CryptoJS.enc.Utf8);
}
