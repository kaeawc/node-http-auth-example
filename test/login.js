var querystring = require('querystring');
var assert = require('assert');
var http = require('http');

describe('login', function() {

  var loginData = querystring.stringify({
    'email': 'test@example.com',
    'password': 'areallybadpassword'
  });

  var missingData = querystring.stringify({
    'email': ''
  });

  var loginOptions = {
    port     : 8000,
    hostname : 'localhost',
    method   : 'POST',
    path     : '/login',
    headers  : {
      'Content-Type'   : 'application/x-www-form-urlencoded',
      'Content-Length' : loginData.length
    }
  };

  var missingOptions = {
    port     : 8000,
    hostname : 'localhost',
    method   : 'POST',
    path     : '/login',
    headers  : {
      'Content-Type'   : 'application/x-www-form-urlencoded',
      'Content-Length' : missingData.length
    }
  };

  it('login when given valid user credentials', function(done) {
    http.request(
      loginOptions,
      function(response) { 
        assert.equal(response.statusCode, 303);
        done();
      }
    ).write(loginData);
  });

  it('should respond with unauthorized when missing form data', function(done) {
    http.request(
      missingOptions,
      function(response) { 
        assert.equal(response.statusCode, 401);
        done();
      }
    ).write(missingData);
  });
});
