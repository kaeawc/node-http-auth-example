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
  return "fdsafdsa";
}

var useSalt = function(password, salt) {
  return "asdfasdf";
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
  var salt = createSalt();
  var user = {
    'email'    : email,
    'password' : useSalt(password,salt)
  }

  redis.set(hash, JSON.stringify(user), function(error, data) {
    callback(error,data);
  });

  return testUser;
}

var authenticate = function(email, password, callback) {

  console.log("Attempting to authenticate " + email + " with password " + password)

  getByEmail(email, function(error,user) {

    if (error) return callback(error,false);

    if (
      user &&
      user.password &&
      user.password == useSalt(password,user.salt)
    )
      callback(error,user);
    else
      callback(error,false);

  });
}

exports.getByEmail   = getByEmail
exports.create       = create
exports.authenticate = authenticate