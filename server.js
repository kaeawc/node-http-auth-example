var http = require('http');

var fs = require('fs');

var pages = {
  landing : fs.readFileSync('views/landing.html'),
  dashboard : fs.readFileSync('views/dashboard.html'),
  error : {
    unauthorized : fs.readFileSync('views/error/unauthorized.html')
  }
}

var authorized = function(request,response,page) {

  console.log("authorized to view " + request.url);

  response.writeHead(200, {});

  response.end(page);

}

var unauthorized = function(request,response) {

  console.log("unauthorized to view " + request.url);

  response.writeHead(401, {});

  response.end(pages.error.unauthorized);

}

var dashboard = function(response) {

  response.writeHead(200, {});

  response.end(pages.dashboard);

}

var validCookie = function(request) {
  return (request.headers && request.headers.cookie);
}

var listener = function(request,response) {

  switch (request.url) {
    case "/":
      authorized(request,response,pages.landing);
      break;
    case "/dashboard":

      if (validCookie(request))
        authorized(request,response,pages.dashboard);
      else
        unauthorized(request,response);

      break;
    default:
      unauthorized(request,response);
      break;
  }
}

var server = http.createServer(listener);

server.listen(8000);