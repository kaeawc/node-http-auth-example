var http = require('http');

var fs = require('fs');

var pages = {
  landing : fs.readFileSync('views/landing.html'),
  dashboard : fs.readFileSync('views/dashboard.html'),
  error : {
    unauthorized : fs.readFileSync('views/error/unauthorized.html')
  }
}

var listener = function(request,response) {

  console.log(request.url);

  if (authorized(request)) {

    console.log("authorized");

    response.writeHead(200, {});

    response.end(pages.landing);

  } else {

    console.log("unauthorized");

    unauthorized(response);
  }
}

var unauthorized = function(response) {

  response.writeHead(401, {});

  response.end(pages.error.unauthorized);

}

var dashboard = function(response) {

  response.writeHead(200, {});

  response.end(pages.dashboard);

}

var authorized = function(request) {

  return (request.url == "/");

}

var server = http.createServer(listener);

server.listen(8000);