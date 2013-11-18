var http = require('http');

var fs = require('fs');

var loadView = function(page) {

  console.log("loadView");
  
  fs.readFileSync(page);
  console.log('loaded ' + page)
}

var pages = {
  landing : loadView('views/landing.html'),
  login : loadView('views/login.html'),
  dashboard : loadView('views/dashboard.html'),
  error : {
    unauthorized : loadView('views/error/unauthorized.html')
  }
}

var authorized = function(request,response,page) {

  console.log("authorized");
  

  console.log("authorized to view " + request.url);

  response.writeHead(200, {});

  response.end(page);

}

var unauthorized = function(request,response) {

  console.log("unauthorized");
  

  console.log("unauthorized to view " + request.url);

  response.writeHead(401, {});

  response.end(pages.error.unauthorized);

}

var validCookie = function(request) {

  console.log("validCookie");
  
  return (request.headers && request.headers.cookie);
}

var listener = function(request,response) {

  console.log("listener");
  

  switch (request.url) {
    case "/":
      authorized(request,response,pages.landing);
      break;
    case "/login":
      authorized(request,response,pages.login);
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