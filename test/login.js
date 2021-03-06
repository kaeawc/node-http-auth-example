var querystring = require('querystring');
var assert = require('assert');
var http = require('http');

describe('login', function() {

  var loginData = querystring.stringify({
    'email'    : 'test@example.com',
    'password' : 'areallybadpassword'
  });

  var missingData = querystring.stringify({
    'email': 'fdsa'
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

    this.timeout(5000);

    http.request(
      loginOptions,
      function(response) { 

        assert.equal(response.statusCode, 303);
        assert.equal("/dashboard", response.headers.location);
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
