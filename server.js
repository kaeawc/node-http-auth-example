var http = require('http');

var listener = function(request,response) {

  response.writeHead(200, {});

  response.end('hello world');

}

var server = http.createServer(listener);

server.listen(8000);