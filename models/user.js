crypto = require('crypto');

config = require('../config');

var redis = require('redis').createClient(config.redis.port, config.redis.host);

redis.on("error", function (msg) {
  console.log("Redis Error: " + msg);
});

var testUser = {
  id    : 2314,
  email : "test@example.com"
}

var createSalt = function(callback) {
  crypto.randomBytes(256, function(error, salt) {

    if (error) console.log("Failed make random bytes.")
    else callback(salt.toString('hex'));
  });
}

var useSalt = function(password, salt, callback) {
  crypto.pbkdf2(new Buffer(password, 'hex'),new Buffer(salt, 'hex'),1000,256,callback);
}

var del = function(email, callback) {
  var hash = "user:" + email;

  redis.get(hash, function(error, data) {
    if(error)
      callback(error,false);
    else
      callback(false,data);
  });
}

var getByEmail = function(email, callback) {

  var hash = "user:" + email

  redis.get(hash, function(error, data) {

    if(error)
      callback(error,false);
    else {
      if(data)
        callback(false,JSON.parse(data));
      else {
        callback("No such user found.",false);
      }
    }
  });
}

var create = function(email, password, callback) {

  var hash = "user:" + email

  createSalt(function(salt) {

    useSalt(password,salt,function(error, hashedPassword) {

      var user = {
        'email'    : email,
        'salt'     : salt,
        'password' : hashedPassword.toString('hex')
      };

      redis.set(hash, JSON.stringify(user), function(error, data) {
        if (error)
          callback(error, false);
        else
          getByEmail(email, callback);
      });

    });
  });
}

var authenticate = function(email, password, callback) {

  getByEmail(email, function(error,user) {

    if (error) return callback(error,false);

    if (user && user.password && user.salt) {
      useSalt(password,user.salt, function(error, hashedPassword) {

        if (error) return callback(error,false);

        if (user.password == hashedPassword.toString('hex'))
          callback(error,user);
        else
          callback("The given password is not correct.",false);
      });
    } else
      callback("The user object was not properly formed.",false);

  });
}

exports.getByEmail   = getByEmail
exports.create       = create
exports.authenticate = authenticate