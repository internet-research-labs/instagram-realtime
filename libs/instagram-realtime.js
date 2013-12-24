var util      = require('util');
var events    = require('events');
var request   = require('request');

// LOCAL
var InstagramSubscriber = require('./InstagramSubscriber.js');

/**
 * Stream Object
 * Creates an InstagramStream usable with triggers
 * TODO: Make the stream *inherit* the subscription manager
 * @param {!Server} server  a Node HTTP server or Express App()
 * @param {object}  opts    options object
 */
util.inherits(Stream, events.EventEmitter);
function Stream (server, opts) {
  'use strict';

  opts = opts ? opts : {};

  var self = this;

  if (!opts.client_id) {
    console.log('Invalid "client_id"'.yellow);
  }

  if (!opts.client_secret) {
    console.log('Invalid "client_secret"'.yellow);
  }

  if (!opts.callback_url) {
    console.log('Invalid "callback_url"'.yellow);
  }

  if (!opts.callback_path) {
    console.log('Invalid "callback_path"'.yellow);
  }

  // TODO: Update rest of program to use these variables
  this.client_id      = opts.client_id;
  this.client_secret  = opts.client_secret;
  this.callback_url   = opts.callback_url;

  // TODO: Remove all mention of these variables
  var _client_id      = opts.client_id;
  var _client_secret  = opts.client_secret;
  var _callback_url   = opts.url + '/' + opts.callback_path;

  // Subscription Manager
  var _subscriber = new InstagramSubscriber(this, _client_id, _client_secret, _callback_url);

  // Methods
  this.request_tag_media = request_tag_media;

  // Subscription request
  server.get('/' + opts.callback_path, function (req, resp) {
    resp.set('Content-Type', 'text/plain');
    resp.send(req.param('hub.challenge'));
  });

  // New media published
  server.post('/' + opts.callback_path, function (req, resp) {
    resp.set('Content-Type', 'text/plain');
    resp.send('great'.rainbow);
    self.request_tag_media(self.tag);
  });

  // ((Hoisted below))

  /**
   * Make a Request to Receive Tag Media
   * Submits a request to the Instagram API server.
   * @param {String} tag string specifying which tag to get new media from
   */
  function request_tag_media (tag) {
    var url = 'https://api.instagram.com/v1';
    url += '/tags/' + tag;
    url += '/media/recent';
    url += '?client_id='  + _client_id;
    request.get(url, request_media_handler);
  }

  /**
   * Handler Response from Request to Instagram API for Tag Media
   * Checks whether status code is 200 and result is parsable JSON. On success,
   * emit a 'new' event. On failure, it emits an 'error' event
   * @param   {String}    error an error string
   * @param   {!Response} resp  response object 
   * @param   {Object}    body  the parsed response
   * @return  {undefined}       undefined
   */
  function request_media_handler (error, resp, body) {
    if (resp.statusCode !== 200) {
      console.log('request_media_handler: invalid status code'.red);
      self.emit('error', error, resp, body);
      return;
    }

    try {
      self.emit('new', resp, body);
    }
    catch (err) {
      console.log(err);
      console.log('JSON object was not parsed');
      self.emit('error', error, resp, body);
    }
  }

  // Inherit event emitter
  events.EventEmitter.call(this);

  /**
   * Subscribe to an Instagram Feed
   * Subscribes to an instagram feed using a POST request
   * @param {String} tag a hash-tag to follow
   */
  this.subscribe = function (term) {
    // Contains subscription to users
    if (typeof term.user !== 'undefined' && term.user) {
      _subscriber.subscribe_user();
    }
    // Contains subscription to tag
    if (typeof term.tag === 'string' && term.tag !== '') {
      _subscriber.subscribe_tag(term.tag);
    }
    // Contains subscription to location-id
    if ((typeof term.location === 'number' || typeof term.location === 'string') && term.location !== '') {
      _subscriber.subscribe_location(term.location);
    }
    // Contains subscription to geography coordinates
    if (typeof term.lat === 'number' && typeof term.lng === 'number' && typeof term.radius === 'number') {
      _subscriber.subscribe_geography(term.location);
    }
  };

  /**
   * Unsubscribe to All Instagram Subscriptions
   * Subscribes to an instagram feed using a POST request
   * @param {String} tag a hash-tag to follow
   */
  this.unsubscribe_all = function () {
    _subscriber.unsubscribe('all');
  };
}


// Exports
exports.Stream = Stream;
