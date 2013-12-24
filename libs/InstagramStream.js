var events  = require('events');
var util    = require('util');
var connect = require('connect');
var static = require('./static.js');

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
  static.call(this, server);

  // This block adds the subscription and new media responses
}

InstagramStream.prototype.subscribe = function () {
};

InstagramStream.prototype.unsubscribe = function () {
};

// LISTEN = CONSTRUCTOR
InstagramStream.prototype.listen = InstagramStream;

// Exports
module.exports = InstagramStream;
