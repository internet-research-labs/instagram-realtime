var url = require('url');

function attach (route, get, post) {
  var prepend = route.substring(0, 1) !== '/' ? '/' : '';
  route = prepend + route;

  var listeners = this.listeners('request');
  this.removeAllListeners('request');
  this.on('request', function (req, resp) {
    var parts = url.parse(req.url, true);
    var pathname = parts.pathname;
    var hub = parts.query['hub.challenge'];
    if (req.method === 'POST' && pathname === route) {
      post.call(this, req, resp);
    }
    else if (req.method === 'GET' && pathname === route) {
      get.call(this, req, resp);
    }
    else {
      for (var k = 0; k < listeners.length; k++) {
        listeners[k].call(this, req, resp);
      }
    }
  });

}

module.exports = attach;
