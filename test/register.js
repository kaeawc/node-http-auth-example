var querystring = require('querystring');
var assert = require('assert');
var http = require('http');

describe('register', function() {

  var registerData = querystring.stringify({
    'email'           : 'test@example.com',
    'password'        : 'areallybadpassword',
    'retypedPassword' : 'areallybadpassword'
  });

  var missingData = querystring.stringify({
    'email': ''
  });

  var registerOptions = {
    port     : 8000,
    hostname : 'localhost',
    method   : 'POST',
    path     : '/register',
    headers  : {
      'Content-Type'   : 'application/x-www-form-urlencoded',
      'Content-Length' : registerData.length
    }
  };

  var missingOptions = {
    port     : 8000,
    hostname : 'localhost',
    method   : 'POST',
    path     : '/register',
    headers  : {
      'Content-Type'   : 'application/x-www-form-urlencoded',
      'Content-Length' : missingData.length
    }
  };

  it('register when given valid user credentials', function(done) {

    this.timeout(5000);
    
    http.request(
      registerOptions,
      function(response) { 
        assert.equal(response.statusCode, 303);
        assert.equal("/dashboard", response.headers.location);
        done();
      }
    ).write(registerData);
  });

  it('should respond with unauthorized when missing form data', function(done) {
    http.request(
      missingOptions,
      function(response) { 
        assert.equal(response.statusCode, 400);
        done();
      }
    ).write(missingData);
  });
});
