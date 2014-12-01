var InstagramStream = require('../src/InstagramStream.js');
// var nockInstagramApi = require('../mock/nock-instagram-api.js');

var expect = require('chai').expect;
var nock   = require('nock');
var request = require('request');

var app     = require('express')();


/**
 * SETUP ALL THE NOCK STUFF
 * SETUP ALL THE NOCK STUFF
 * SETUP ALL THE NOCK STUFF
 */

nock('https://api.instagram.com')
  .persist()
  .post('/v1/subscriptions/')
  .reply(200, 'whatever');

//
//
//
//
//

describe('InstagramStream', function () {

  var server  = require('http').createServer(app).listen(process.env.PORT || 5000);
  var opts    = {
    client_id     : 'XXXXXXXXXXXXXXXXXXXX',
    client_secret : 'XXXXXXXXXXXXXXXXXXXX',
    url           : 'http://whatever.com',
    callback_path : 'callback'
  };

  // Subscribe/Unsubscribe tests
  describe('subscribe', function () {

    var stream = InstagramStream( server, { });

    it('should trigger subscription success event', function (done) {

      stream.on('subscribe', function () {
        done();
      });

      stream.on('subscribe/error', function () {
        expect(1).to.equal(-1);
        done();
      });

      stream.subscribe({ tag : 'yolo' });
    });

    // New media tests

  });

});
