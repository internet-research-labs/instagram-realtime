var url     = require('url');

function static (server) {
  var listeners = server.listeners('request');
  server.removeAllListeners('request');
  server.on('request', function (req, resp) {
    var parts = url.parse(req.url, true);
    if (parts.pathname === '/callback') {
      var val = parts.query['hub.challenge'];
      resp.end(val ? val : 'vvhatever');
      switch (req.method) {
      case 'POST':
        break;
      case 'GET':
        break;
      default:
        console.log('very very bad');
      }
    }
    else {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].call(server, req, resp);
      }
    }
  });
}

function verify () {
}

function new_media () {
}

module.exports = static;
