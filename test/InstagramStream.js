var assert = require('assert');

var secrets = require('../secrets.json');
var express = require('express');
var app     = express();
var server  = require('http').createServer(app).listen(process.env.PORT || 5000);
var InstagramStream = require('../libs/InstagramStream.js');

describe('InstagramStream', function () {
  this.timeout(3000);

  // Test server
  var stream = InstagramStream(server, secrets.instagram);

  // Unsubscribe
  describe('(unsubscribe)', function () {
    it('should receive HTTP 200', function (done) {
      stream.on('unsubscribe', function () {
        done();
      });
      stream.unsubscribe('all');
    });
  });

  // Subscribe
  describe('(subscribe to tag)', function () {
    it('to tag "yolo"', function (done) {
      stream.on('subscribe', function () {
        done();
      });
      stream.subscribe({ tag : 'yolo' });
    });
  });
});
