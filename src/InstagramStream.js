// External dependencies
var connect = require('connect');
var events  = require('events');
var util    = require('util');
var url     = require('url');
// Internal dependencies
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

  opts = opts || {};

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

  this.last = {};
  this.last.response  = undefined;
  this.last.body      = undefined;
  this.last_body      = undefined;    // TODO: Remove this

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

    chain.use(connect.bodyParser());

    chain.use(function (req, resp, next) {
      var pathname = url.parse(req.url).pathname;
      if (req.method === 'GET' && pathname === '/' + self.callback_path) {
        var hub_challenge = url.parse(req.url, true).query['hub.challenge'];
        resp.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        resp.end(hub_challenge ? hub_challenge : '🍕');
      }
      else if (req.method === 'POST' && pathname === '/' + self.callback_path) {
        resp.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        resp.end('🍕');
        route_traffic(req.body, req);
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
    id = id || 'all';
    _sub.unsubscribe(id);
  }
  /**
   * Request a Media Search from Instagram Based on an HTTP-Request
   * ~~~
   * @param {!Request Body} body an HTTP-request from the InstagramAPI containing
   * object-id and subscription-id information. This can determine which type of
   * subscription was sent, and what its purpose was.
   */
  function route_traffic (body) {
    for (var k = 0; k < body.length; k++) {
      route_individual_media_response(body[k]);
    }
  }

  function route_individual_media_response (result) {
    var sub_type = result.object;
    var sub_id = result.subscription_id;
    var obj_id = result.object_id;

    if (!(sub_id && obj_id)) {
      console.log('bad result... this seems like an Instagram API problem');
      console.log('sub_id = ' + sub_id);
      console.log('obj_id = ' + obj_id);
    }

    switch (sub_type) {
    case 'user':
      console.log('routing user-media traffic');
      console.log('NOTE: this is *not* implemented');
      _fetch.get_user();
      break;

    case 'tag':
      _fetch.get_tag(obj_id);
      break;

    case 'location':
      _fetch.get_location(obj_id);
      break;

    case 'geography':
      _fetch.get_geography(obj_id);
      break;

    default:
      console.log('bad media update');
      return;
    }
  }
}

// LISTEN = CONSTRUCTOR
InstagramStream.prototype.listen = InstagramStream;


// Exports
module.exports = InstagramStream;
