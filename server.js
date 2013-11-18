
var http = require('http');

var routes = require('./routes');

var port = 8000;

var listener = require('./routes/listener')

var server = http.createServer(listener);

server.listen(port);

console.log("Server listening on port " + port)
