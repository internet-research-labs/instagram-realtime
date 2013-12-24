var request = require('request');

/**
 * MediaFetcher
 * Helps with pulling new media
 */
function MediaFetcher (parent, client_id, client_secret, callback_url) {
  this.client_id      = client_id;
  this.client_secret  = client_secret;
  this.callback_url   = callback_url;
}

MediaFetcher.prototype.get_user = function (id) {
  if (typeof id !== 'string') {
    console.log('User search must have id\'s');
  }

  var url = 'https://api.instagram.com/v1';
  url += '/users/' + id;
  url += '/media/recent';
  url += '?client_id='  + this.client_id;

  console.log(url);

  request.get(url, request_media_handler);
};

MediaFetcher.prototype.get_tag = function (tag) {
  var url = 'https://api.instagram.com/v1';
  url += '/tags/' + tag;
  url += '/media/recent';
  url += '?client_id='  + this.client_id;

  console.log(url);

  request.get(url, request_media_handler);
};

MediaFetcher.prototype.get_location = function (id) {
  var url = 'https://api.instagram.com/v1';
  url += '/locations/' + id;
  url += '/media/recent';
  url += '?client_id='  + this.client_id;

  console.log(url);

  request.get(url, request_media_handler);
};

MediaFetcher.prototype.get_geography = function (lat, lng, rad) {
  var url = 'https://api.instagram.com/v1';
  url += '/media/search';
  url += '?lat=' + lat;
  url += '&lng=' + lng;
  url += '&distance=' + rad;

  console.log(url);

  request.get(url, request_media_handler);
};

function request_media_handler (error, resp, body) {
} 

module.exports = MediaFetcher;
