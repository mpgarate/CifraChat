function encryptMessage(message,password){
  if (password === ''){
    password = "tRe_haxucr6hej8s";
    console.log("replaced password (encrypt)");
  }

  var encrypted = CryptoJS.AES.encrypt(message, password);
  return encrypted.toString();
}

function decryptMessage(message,password){
  if (password === ''){
    password = "tRe_haxucr6hej8s";
    console.log("replaced password (decrypt)");
  }

  var decrypted = CryptoJS.AES.decrypt(message, password);
  return decrypted.toString(CryptoJS.enc.Utf8);
}
