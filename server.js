var http = require('http');

var listener = function(request,response) {

  response.writeHead(200, {});

  response.end('<!doctype html><html><head></head><body>Hello World</body></html>');

}

var server = http.createServer(listener);

server.listen(8000);