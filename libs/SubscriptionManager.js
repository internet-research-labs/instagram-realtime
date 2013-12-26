var request = require('request');
var connect = require('connect');
var url = require('url');

/**
 * SubscriptionManager
 * Helps with Instagram Subscriptions
 */
function SubscriptionManager (params) {
  this.parent = params.parent;
  this.server = params.server;
  this.client_id      = params.client_id;
  this.client_secret  = params.client_secret;
  this.callback_url   = params.callback_url;
  var self = this;

  this.subscribe_handler = function (error, resp, body) {
    if (resp.statusCode === 200) {
      self.parent.emit('subscribe', resp, body);
    }
    else {
      self.parent.emit('subscribe/error', error, resp, body);
    }
  };

  this.unsubscribe_handler = function (error, resp, body) {
    if (resp.statusCode === 200) {
      self.parent.emit('unsubscribe', resp, body);
    }
    else {
      self.parent.emit('unsubscribe/error', error, resp, body);
    }
  };
}

/**
 * Subscribe to Users
 * Send an HTTP POST-request to the Instagram API, requesting a realtime
 * subscription to the full set of authenticated to the app.
 * @return {undefined} undefined
 */
SubscriptionManager.prototype.subscribe_user = function () {
  'use strict';
  var url = 'https://api.instagram.com/v1/subscriptions/';
  var data = {
    client_id     : this.client_id,
    client_secret : this.client_secret,
    object        : 'user',
    aspect        : 'media',
    callback_url  : this.callback_url
  };
  request.post(url, { form : data }, this.subscribe_handler);
};

/**
 * Subscribe to a Hashtag
 * Send an HTTP POST-request to the Instagram API, requesting a realtime
 * subscription to a specific hashtag.
 * @param {string} tag a hashtag
 * @return {undefined} undefined
 */
SubscriptionManager.prototype.subscribe_tag = function (tag) {
  'use strict';
  var url = 'https://api.instagram.com/v1/subscriptions/';
  var data = {
    client_id     : this.client_id,
    client_secret : this.client_secret,
    object        : 'tag',
    aspect        : 'media',
    object_id     : tag,
    callback_url  : this.callback_url
  };
  request.post(url, { form : data }, this.subscribe_handler);
};

/**
 * Subscribe to Location by ID
 * Send an HTTP POST-request to the Instagram API, requesting a realtime
 * subscription to a specific, location via ID.
 * @param {string} id an identification string for a particular location
 * @return {undefined} undefined
 */
SubscriptionManager.prototype.subscribe_location = function (id) {
  'use strict';
  var url = 'https://api.instagram.com/v1/subscriptions/';
  var data = {
    client_id     : this.client_id,
    client_secret : this.client_secret,
    object        : 'location',
    aspect        : 'media',
    object_id     : id,
    callback_url  : this.callback_url
  };
  request.post(url, { form : data }, this.subscribe_handler);
};

/**
 * Subscribe to a Longitude-Latitude Coordinate
 * Send an HTTP POST-request to the Instagram API, requesting a realtime
 * subscription to a specific, longitude-latitude coordinate with a radius.
 * @param {string} id an identification string for a particular location
 * @param {object} pos an object containing 3 numeric properties:
 * "lng", longitude coordinate, "lat", latitude coordinate, and "rad", the radius
 * @return {undefined} undefined
 */
SubscriptionManager.prototype.subscribe_geography = function (lat, lng, rad) {
  lng = typeof lng === 'number' ? lng : 10;
  lat = typeof lat === 'number' ? lat : 10;
  rad = typeof rad === 'number' && rad >= 0 ? rad : 1000;
  var url = 'https://api.instagram.com/v1/subscriptions/';
  var data = {
    client_id     : this.client_id,
    client_secret : this.client_secret,
    object        : 'geography',
    aspect        : 'media',
    lat           : lat,
    lng           : lng,
    radius        : rad,
    callback_url  : this.callback_url
  };
  request.post(url, { form : data }, this.subscribe_handler);
};

/**
 * Delete Subscriptions
 * Sends a DELETE HTTP-Request with client information to Instagram API. This
 * cancels a specific media subscription, if "id" is an identifier.
 * If "id" is "all or undefined, all subscriptions are cancelled.
 * @param {number or string} id a number of string representing the subscription
 * to cancel
 * @return {undefined} undefined
 */
SubscriptionManager.prototype.unsubscribe = function (id) {
  'use strict';
  id = typeof id !== 'undefined' ? id : 'all';
  var url = 'https://api.instagram.com/v1/subscriptions';
  url += '?client_secret='  + this.client_secret;
  url += '&client_id='      + this.client_id;
  url += '&object='         + id;
  request.del(url, this.unsubscribe_handler);
};

// ...
module.exports = SubscriptionManager;
