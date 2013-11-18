assert = require('assert');
http = require('http');

describe('http', function() {
  it('should answer with "hello world"', function() {
    var options = {
      host:"localhost",
      port:8000,
      path:"/"
    }

    http.get(options, function(response) {
      assert.equal(response.statusCode, 200);
      response.setEncoding('utf8');
      response.on('data', function(html) {
        assert.ok(html.indexOf("Hello World"));
      });
    });
  });
});
