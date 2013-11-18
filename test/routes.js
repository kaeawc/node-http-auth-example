assert = require('assert');
http = require('http');

describe('http', function() {
  it('should answer with "hello world"', function(done) {
    http.get("http://localhost:8000", function(response) {
      assert.equal(response.statusCode, 200);
      response.setEncoding('utf8');
      response.on('data', function(html) {
        assert.ok(html.indexOf("Hello World"));
        done();
      });
    });
  });

  it('should return unauthorized when requesting secure content without credentials', function(done) {
    http.get("http://localhost:8000/dashboard", function(response) {
      assert.equal(response.statusCode, 401);
      response.setEncoding('utf8');
      response.on('data', function(html) {
        assert.ok(html.indexOf("Sorry, You are Not Authorized To View This Content"));
        done();
      });
    });
  });
});
