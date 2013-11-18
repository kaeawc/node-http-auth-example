var qs = require('querystring');

var http = require('http');

var routes = require('./routes');

var userCookieKey = "user";

var testUser = 2314;

var port = 8000;

/**
 * Render the given page with HTTP 200.
 */
var ok = function(request,response,page) {

  response.writeHead(200, {});

  response.end(page);

}

/**
 * Redirect the to the given url.
 */
var redirectTo = function(response,page,url) {

  response.writeHead(303, {"url":url});

  response.end(page);

}

/**
 * Writes an authentication cookie to the given response
 * @param  {Response}  response The response for which the cookie will be set
 * @param  {String}    key      String: The key to set
 * @param  {String}    value    String: The value to set
 * @param  {Boolean}   expires  Boolean: if true, will expire in 1 year, otherwise will expire when the browser closes
 * @param  {Boolean}   http     Boolean: if true, will only serve and accept this cookie over HTTP
 * @param  {Boolean}   isSecure Boolean: if true, will only serve this cookie over SSL
 * @param  {String}    path     String: Optional resource path on domain.  Defaults to entire domain.
 * @return {Response}
 */
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

/**
 * Render the Unauthorized error page.
 */
var unauthorized = function(request,response) {

  response.writeHead(401, {});

  response.end(routes.error.unauthorized);

}

/**
 * Check if a cookie exists and if it is valid.
 */
var validCookie = function(request) {

  return (
    request.headers &&
    request.headers.cookie &&
    request.headers.cookie == (userCookieKey + "=" + testUser)
  );
}

/**
 * [ description]
 * @param  {[type]}   request  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
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
      ok(request,response,routes.landing);
      break;
    case "GET /login":
      ok(request,response,routes.login);
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
        ok(request,response,routes.dashboard);
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
