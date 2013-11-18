crypto = require('crypto');

config = require('../config');

var redis = require('redis').createClient(config.redis.port, config.redis.host);

redis.on("error", function (msg) {
  console.log("Redis Error: " + msg);
});

var createSalt = function(callback) {
  crypto.randomBytes(4096, function(error, salt) {

    if (error) console.log("Failed make random bytes.")
    else callback(salt.toString('hex'));
  });
}

var useSalt = function(token, salt, callback) {
  crypto.pbkdf2(new Buffer(token, 'hex'),new Buffer(salt, 'hex'),1000,4096,callback);
}

var del = function(email, callback) {
  var hash = "user:" + email + ":session";

  redis.get(hash, function(error, data) {
    if(error)
      callback(error,false);
    else
      callback(false,data);
  });
}

var getByEmail = function(email, callback) {

  var hash = "user:" + email + ":session";

  redis.get(hash, function(error, data) {

    if(error)
      callback(error,false);
    else {
      if(data)
        callback(false,JSON.parse(data));
      else {
        callback("No such user session found.",false);
      }
    }
  });
}

var create = function(email, callback) {

  var hash = "user:" + email + ":session";

  createSalt(function(token) {
    createSalt(function(salt) {

      useSalt(token,salt,function(error, hashedPassword) {

        var privateSession = {
          'email'    : email,
          'salt'     : salt,
          'token'    : hashedPassword.toString('hex')
        };

        var publicSession = {
          'email' : email,
          'token' : token
        }

        console.log("make private session: ");
        console.log(privateSession);
        console.log("make public session: ");
        console.log(publicSession);


        redis.set(hash, JSON.stringify(privateSession), function(error, data) {
          callback(error,publicSession);
        });

      });
    });
  });
}

var authenticate = function(email, token, callback) {

  getByEmail(email, function(error,userSession) {

    if (error) return callback(error,false);

    if (userSession && userSession.token && userSession.salt) {
      useSalt(token,userSession.salt, function(error, hashedPassword) {

        if (error) return callback(error,false);

        if (userSession.token == hashedPassword.toString('hex'))
          callback(error,userSession);
        else
          callback("The given token is not correct.",false);
      });
    } else
      callback("The userSession object was not properly formed.",false);

  });
}

exports.getByEmail   = getByEmail
exports.create       = create
exports.authenticate = authenticate