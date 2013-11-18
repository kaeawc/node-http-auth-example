var crypto = require('../crypto');

var config = require('../config');

var port = process.env.REDIS_PORT || config.redis.port;
var host = process.env.REDIS_HOST || config.redis.host;
var redis = require('redis').createClient(port, host);

redis.on("error", function (msg) {
  console.log("Redis Error: " + msg);
});

var del = function(email, callback) {
  var hash = "user:" + email;

  redis.del(hash, function(error, data) {
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

  crypto.createSalt(function(salt) {

    crypto.useSalt(password,salt,function(error, hashedPassword) {

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
      crypto.useSalt(password,user.salt, function(error, hashedPassword) {

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