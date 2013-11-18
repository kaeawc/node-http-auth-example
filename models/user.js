
var testUser = {
  id    : 2314,
  email : "test@example.com"
}

exports.getById = function(id) {
  return testUser;
}

exports.getByEmail = function(email) {
  return testUser;
}

exports.create = function(email,password) {
  return testUser;
}

exports.authenticate = function(email,password) {

  if(email == "test@example.com" && password == "areallybadpassword")
    return testUser;
  else
    return false;
}