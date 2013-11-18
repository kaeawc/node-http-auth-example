console.log("Starting up web server...");

var http = require('http');

var routes = require('./routes');

var port = process.env.PORT || require('./config').server.port;

var listener = require('./routes/listener');

var server = http.createServer(listener);

server.listen(port);

console.log("Server listening on port " + port)
