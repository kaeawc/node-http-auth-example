crypt = require('crypto');

secret = require('../config').application.secret

var createSalt = function(callback) {
  crypt.randomBytes(128, function(error, salt) {

    if (error) console.log("Failed make random bytes.")
    else callback(salt.toString('hex'));
  });
}

var useSalt = function(password, salt, callback) {
  crypt.pbkdf2(new Buffer(password, 'hex'),new Buffer(salt, 'hex'),1000,128,callback);
}

var encrypt = function(plainText) {
  console.log("Encrypting...")
  var cipher = crypt.createCipher('aes-256-cbc',secret.key,secret.iv)
  var encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

var decrypt = function(cipherText) {
  console.log("Decrypting...")
  var cipher = crypt.createDecipher('aes-256-cbc',secret.key,secret.iv);
  var plainText  = cipher.update(cipherText, 'base64', 'utf8');
  plainText += cipher.final('utf8');
  return plainText;
}

exports.createSalt   = createSalt
exports.useSalt      = useSalt
exports.encrypt      = encrypt
exports.decrypt      = decrypt