var connect     = require('connect');
var querystring = require('querystring');
var url = require('url');

function route (parent, server, callback_path) {
  var prepend = callback_path.substring(0, 1) !== '/' ? '/' : '';
  callback_path = prepend + callback_path;

  var listeners = server.listeners('request');

  var chain = connect();
  chain.use(
    connect.bodyParser()
  ).use(function (req, resp) {
    var parts = url.parse(req.url, true);
    var pathname = parts.pathname;
    var hub_challenge = parts.query['hub.challenge'];

    if (req.method === 'GET' && pathname === callback_path) {
      resp.setHeader('Content-Type', 'text/plain');
      resp.end(hub_challenge ? hub_challenge : '🍕');
    }
    else if (req.method === 'POST' && pathname === callback_path) {
      resp.setHeader('Content-Type', 'text/plain; charset=utf-8');
      resp.end('🍕');
      parent.emit('new', req, resp);
    }
    else {
      for (var k = 0; k < listeners.length; k++) {
        listeners[k].call(server, req, resp);
      }
    }

  });

  server.removeAllListeners('request');
  server.on('request', chain);

  // Replace 'request' event with  one that branches:
  // If we are in a scenario about responding to subscriptions,
  //  then respond appropriately
  // Else
  //  Do whatever listeners are attach in their proper order
  //  
  // @TODO: Figure out how to do this a little more elegantly (???)
}

module.exports = route;


// ~function () {
//   var server = params.server;
//   var listeners = server.listeners('request');
//
//   var chain = connect();
//
//   chain.use(function (req, resp, next) {
//     var pathname = url.parse(req.url).pathname;
//     if (req.method === 'GET' && pathname === '/callback') {
//       resp.writeHeader('Content-Type: text/plain; charset=utf-8');
//       resp.end('🍕');
//     }
//     else {
//       next();
//     }
//   });
//
//   chain.use(function (req, resp) {
//     for (var k = 0; k < listeners.length; k++) {
//       listeners[k].call(server, req, resp);
//     }
//   });
//
//   server.removeAllListeners('request');
//   server.on('request', chain);
// }();
