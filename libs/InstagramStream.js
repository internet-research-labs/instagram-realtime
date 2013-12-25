// External dependencies
var connect = require('connect');
var events  = require('events');
var util    = require('util');
var url     = require('url');
// Internal dependencies
var route = require('./route.js');
var SubscriptionManager = require('./SubscriptionManager.js');
var MediaFetcher        = require('./MediaFetcher.js');

// Inheritance
util.inherits(InstagramStream, events.EventEmitter);

/**
 * InstagramStream Object
 * Creates an InstagramStream usable with triggers
 * @param {!Server} server  a Node HTTP server or Express App()
 * @param {object}  opts    options object
 */
function InstagramStream (server, opts) {
  if (!(this instanceof InstagramStream)) {
    return new InstagramStream(server, opts);
  }

  // Call super constructor
  events.EventEmitter.call(this);

  // Shift over parameters, if there is no server in the first slot
  if (typeof server === 'object' && typeof server.listen !== 'function') {
    server  = null;
    opts    = server;
  }

  // Warn user about invalid options
  if (!opts.client_id) {
    console.log('Invalid "client_id"'.yellow);
  }
  if (!opts.client_secret) {
    console.log('Invalid "client_secret"'.yellow);
  }
  if (!opts.url) {
    console.log('Invalid "url"'.yellow);
  }
  if (!opts.callback_path) {
    console.log('Invalid "callback_path"'.yellow);
  }

  // Create object
  this.client_id      = opts.client_id;
  this.client_secret  = opts.client_secret;
  this.callback_url   = opts.url + '/' + opts.callback_path;
  this.url            = opts.url;
  this.callback_path  = opts.callback_path;

  // Defaults
  this.callback_path = this.callback_path ? this.callback_path : 'callback';
  var self = this;

  var _sub = new SubscriptionManager({
    parent  : this,
    client_id     : this.client_id,
    client_secret : this.client_secret,
    callback_url  : this.callback_url
  });

  var _fetch = new MediaFetcher({
    parent  : this,
    client_id     : this.client_id,
    client_secret : this.client_secret,
    callback_url  : this.callback_url
  });

  // Route '/:callback' -> custom handlers
  ~function () {
    var listeners = server.listeners('request');

    var chain = connect();

    // TODO: Add media requests and subscription verifications ++ event emitters
    chain.use(function (req, resp, next) {
      var pathname = url.parse(req.url).pathname;
      // TODO: Make it about matching the URL!
      if (req.method === 'GET' && pathname === '/' + self.callback_path) {
        var hub_challenge = url.parse(req.url, true).query['hub.challenge'];
        resp.writeHeader('Content-Type: text/plain; charset=utf-8');
        resp.end(hub_challenge ? hub_challenge : '🍕');
      }
      else if (req.method === 'POST' && pathname === '/' + self.callback_path) {
        resp.writeHeader('Content-Type: text/plain; charset=utf-8');
        resp.end('🍕');
      }
      else {
        next();
      }
    });

    chain.use(function (req, resp) {
      for (var k = 0; k < listeners.length; k++) {
        listeners[k].call(server, req, resp);
      }
    });

    server.removeAllListeners('request');
    server.on('request', chain);
  }();

  this.subscribe = function (term) {
    // Contains subscription to users
    if (typeof term.user !== 'undefined' && term.user) {
      _sub.subscribe_user();
    }
    // Contains subscription to tag
    if (typeof term.tag === 'string' && term.tag !== '') {
      _sub.subscribe_tag(term.tag);
    }
    // Contains subscription to location-id
    if ((typeof term.location === 'number' || typeof term.location === 'string') && term.location !== '') {
      _sub.subscribe_location(term.location);
    }
    // Contains subscription to geography coordinates
    if (typeof term.lat === 'number' && typeof term.lng === 'number' && typeof term.radius === 'number') {
      _sub.subscribe_geography(term.location);
    }
  };

  this.unsubscribe = function (id) {
    _sub.unsubscribe('all');
  }
}

// LISTEN = CONSTRUCTOR
InstagramStream.prototype.listen = InstagramStream;

// Exports
module.exports = InstagramStream;
