var http = require('http');

var fs = require('fs');

var landing = fs.readFileSync('views/index.html');

var listener = function(request,response) {

  response.writeHead(200, {});

  response.end(landing);

}

var server = http.createServer(listener);

server.listen(8000);