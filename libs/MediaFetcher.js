var request = require('request');

/**
 * MediaFetcher
 * Helps with pulling new media
 */
function MediaFetcher (params) {
  var self = this;
  self.parent = params.parent;
  self.server = params.server;
  self.client_id      = params.client_id;
  self.client_secret  = params.client_secret;
  self.callback_url   = params.callback_url;

  // Request Media Handler
  self.request_media_handler = function (error, resp, body) {
    if (resp.statusCode === 200) {
      self.parent.emit('new', resp, body);
      self.parent.last.response = resp;
      self.parent.last.body     = body;
      self.parent.last_body     = body;
    }
    else {
      self.parent.emit('new/error', resp, body);
    }
  };
}

/**
 * Get New Media Created by a User
 * Sends an
 */
MediaFetcher.prototype.get_user = function (id) {
  if (typeof id !== 'string') {
    console.log('User search must have id\'s');
  }

  var url = 'https://api.instagram.com/v1';
  url += '/users/' + id;
  url += '/media/recent';
  url += '?client_id='  + this.client_id;

  request.get(url, this.request_media_handler);
};

MediaFetcher.prototype.get_tag = function (tag) {
  var url = 'https://api.instagram.com/v1';
  url += '/tags/' + tag;
  url += '/media/recent';
  url += '?client_id='  + this.client_id;

  request.get(url, this.request_media_handler);
};

MediaFetcher.prototype.get_location = function (id) {
  var url = 'https://api.instagram.com/v1';
  url += '/locations/' + id;
  url += '/media/recent';
  url += '?client_id='  + this.client_id;

  request.get(url, this.request_media_handler);
};

MediaFetcher.prototype.get_geography = function (id) {
  var url = 'https://api.instagram.com/v1';
  url += '/geographies/' + id;
  url += '/media/recent';
  url += '?client_id='  + this.client_id;

  request.get(url, this.request_media_handler);
};

module.exports = MediaFetcher;
