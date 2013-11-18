var http = require('http');

var fs = require('fs');

var loadView = function(page) {
  
  var file = fs.readFileSync(page);

  console.log('loaded ' + page)

  return file;
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

  console.log("authorized to view " + request.url);

  response.writeHead(200, {});

  response.end(page);

}

var setUserCookie = function(response,user) {
  response.setHeader("Set-Cookie", ["user=" + user]);

  return response;
}

var unauthorized = function(request,response) {

  console.log("unauthorized to view " + request.url);

  response.writeHead(401, {});

  response.end(pages.error.unauthorized);

}

var validCookie = function(request) {
  
  return (request.headers && request.headers.cookie);
}

var listener = function(request,response) {

  switch (request.url) {
    case "/":
      authorized(request,response,pages.landing);
      break;
    case "/login":

      console.log("method was: " + request.method);

      if (request.method == "GET")
        authorized(request,response,pages.login);
      else
        authorized(request,setUserCookie(response),pages.dashboard);
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