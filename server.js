
var http = require('http');

var routes = require('./routes');

var config = require('./config');

var port = config.server.port;

var listener = require('./routes/listener')

var server = http.createServer(listener);

server.listen(port);

console.log("Server listening on port " + port)
