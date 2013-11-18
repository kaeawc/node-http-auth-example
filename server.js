var qs = require('querystring');

var http = require('http');

var routes = require('./routes');

var userCookieKey = "user";

var testUser = 2314;

var port = 8000;

var authorized = function(request,response,page) {

  response.writeHead(200, {});

  response.end(page);

}

var redirectTo = function(response,page,url) {

  response.writeHead(303, {"url":url});

  response.end(page);

}

var setUserCookie = function(response,key,value,expires,http,isSecure,path) {

  var cookie = key + "=" + value;

  if (path)
    cookie += ";Path=" + path;
  else
    cookie += ";Path=/";

  var oneYear = 31536000000

  var nextYear = new Date().getTime() + oneYear

  if (expires)
    cookie += ";expires=" + new Date(nextYear).toUTCString();

  if (http)
    cookie += ";HttpOnly";

  if (isSecure)
    cookie += ";Secure";

  response.setHeader("Set-Cookie", [cookie]);

  return response;
}

var unauthorized = function(request,response) {

  response.writeHead(401, {});

  response.end(routes.error.unauthorized);

}

var validCookie = function(request) {

  return (
    request.headers &&
    request.headers.cookie &&
    request.headers.cookie == (userCookieKey + "=" + testUser)
  );
}

var getRequestBody = function(request,callback) {

  var body = '';

  request.on('data', function (data) {
    body += data;
  });

  request.on('end', function () {
    callback(qs.parse(body));
  });

}

var listener = function(request,response) {

  console.log(new Date() + " " + request.method + " " + request.url)

  switch (request.method + " " + request.url) {
    case "GET /":
      authorized(request,response,routes.landing);
      break;
    case "GET /login":
      authorized(request,response,routes.login);
      break;
    case "POST /login":

      getRequestBody(request, function(body) {

        if (body.email == "asdf" && body.password == "asdf")
          redirectTo(setUserCookie(response,userCookieKey,testUser,true,true),routes.dashboard);
        else
          unauthorized(request,response);
      });

      break;
    case "GET /dashboard":

      if (validCookie(request))
        authorized(request,response,routes.dashboard);
      else
        unauthorized(request,response);

      break;
    default:
      unauthorized(request,response);
      break;
  }
}

var server = http.createServer(listener);

server.listen(port);

console.log("Server listening on port " + port)
