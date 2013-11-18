config = require('../config');

var redis = require('redis').createClient(config.redis.port, config.redis.host);

redis.on("error", function (msg) {
  console.log("Redis Error: " + msg);
});

var testUser = {
  id    : 2314,
  email : "test@example.com"
}

var createSalt = function() {

}

var useSalt = function(password, salt) {
  return "asdfasdf"
}

exports.getByEmail = function(email, callback) {

  var hash = "user:" + email

  redis.get(hash, function(error, data) {
    callback(data);
  });
}

exports.create = function(email, password, callback) {

  var hash = email
  var salt = createSalt();
  var user = {
    'email'    : email,
    'password' : useSalt(password,salt)
  }

  redis.set(hash, function(error, data) {
    callback(error,data);
  });

  return testUser;
}

exports.authenticate = function(email, password, callback) {

  getByEmail(email, function(error,user) {

    if (error) return;

    if (user && user.password && user.password == useSalt(password,user.salt)) {
      callback(user);
    } else {
      callback(false);
    }
  });
}