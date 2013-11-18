var fs = require('fs');

var loadView = function(page) {
  
  var file = fs.readFileSync(page);

  console.log('loaded ' + page);

  return file;
}

var routes = {
  landing : loadView('views/landing.html'),
  login : loadView('views/login.html'),
  dashboard : loadView('views/dashboard.html'),
  error : {
    unauthorized : loadView('views/error/unauthorized.html')
  }
}

module.exports = routes;