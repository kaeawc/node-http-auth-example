var qs = require('querystring');

var users = require('./../models/user');

var userCookieKey = "user";

var routes = require('../routes');

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

  response.writeHead(303, {"Location":url});


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
var deny = function(response) {

  response.writeHead(401, {});

  response.end(routes.error.unauthorized);

  console.log("Sent Unauthorized to User");

}

/**
 * Render the Unauthorized error page.
 */
var bad = function(request,response,page) {

  response.writeHead(400, {});

  response.end(page);

}

var internalError = function(request,response) {

  response.writeHead(500, {});

  response.end(routes.error.internal);

}

/**
 * Check if a cookie exists and if it is valid.
 */
var validCookie = function(request) {

  return (
    request.headers &&
    request.headers.cookie &&
    request.headers.cookie.substring(0,5) == (userCookieKey + "=")
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

module.exports = function(request,response) {

  console.log(new Date() + " " + request.method + " " + request.url);

  switch (request.method + " " + request.url) {

    case "GET /":
    
      ok(request,response,routes.landing);
      break;

    case "GET /register":

      ok(request,response,routes.register);
      break;

    case "POST /register":

      getRequestBody(request, function(body) {

        if (
          body.email.indexOf("@") > 0 &&
          body.email.length > 3 &&
          body.password == body.retypedPassword &&
          body.password.length > 6  
        ) {

          users.create(body.email,body.password, function(error,user) {

            if (error) return console.log("Couldn't create user: " + error);

            if (user)
              redirectTo(setUserCookie(response,userCookieKey,user.id,true,true),routes.dashboard,"/dashboard");
            else
              internalError(request,response,routes.register);            
          });

        } else
          bad(request,response,routes.register);
      });

      break;
    case "GET /login":

      ok(request,response,routes.login);
      break;
    case "POST /login":

      getRequestBody(request, function(body) {

        users.authenticate(body.email,body.password, function(error,user) {

          if (!error && user) {

            console.log("Authenticated User " + user.email)

            redirectTo(setUserCookie(response,userCookieKey,user.email,true,true),routes.dashboard,"/dashboard");
          }
          else {

            console.log("Couldn't authenticate user: " + error);

            deny(response);
          }
        });
      });

      break;
    case "GET /dashboard":

      if (validCookie(request))
        ok(request,response,routes.dashboard);
      else
        deny(response);

      break;
    default:
      deny(response);
      break;
  }
}
