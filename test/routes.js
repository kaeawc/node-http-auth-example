assert = require('assert');
http = require('http');

describe('http', function() {
  it('should answer with "hello world"', function(done) {
    http.get("http://localhost:8000", function(response) {
      assert.equal(response.statusCode, 200);
      done();
    });
  });

  it('should return unauthorized when requesting secure content without credentials', function(done) {
    http.get("http://localhost:8000/dashboard", function(response) {
      assert.equal(response.statusCode, 401);
      done();
    });
  });
});
