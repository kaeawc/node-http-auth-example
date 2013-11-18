crypt = require('crypto');

var createSalt = function(callback) {
  crypt.randomBytes(256, function(error, salt) {

    if (error) console.log("Failed make random bytes.")
    else callback(salt.toString('hex'));
  });
}

var useSalt = function(password, salt, callback) {
  crypt.pbkdf2(new Buffer(password, 'hex'),new Buffer(salt, 'hex'),1000,256,callback);
}

exports.createSalt   = createSalt
exports.useSalt      = useSalt