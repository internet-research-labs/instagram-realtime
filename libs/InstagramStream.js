var events  = require('events');
var util    = require('util');
var connect = require('connect');
var attach = require('./attach.js');
var url = require('url');

util.inherits(InstagramStream, events.EventEmitter);

function InstagramStream (server, opts) {
  if (!(this instanceof InstagramStream)) {
    return new InstagramStream(server, opts);
  }

  if (typeof server === 'object' && typeof server.listen !== 'function') {
    server  = null;
    opts    = server;
  }

  // Add 
  var self = this;
  ~function () {
    var pathname = '/callback';
    attach.call(server, pathname, __get, __post); 

    function __get (req, resp) {
      var hub_challenge = url.parse(req.url, true).query['hub.challenge'];
      resp.setHeader('Content-Type', 'text/plain');
      resp.end(hub_challenge ? hub_challenge : 'vvhatever');
    }

    function __post (req, resp) {
      var body = JSON.parse(resp.body);
      console.log(body);
      resp.end('vvhatever');
    }
  }();
}

InstagramStream.prototype.subscribe = function () {
};

InstagramStream.prototype.unsubscribe = function () {
};

// LISTEN = CONSTRUCTOR
InstagramStream.prototype.listen = InstagramStream;

// Exports
module.exports = InstagramStream;
