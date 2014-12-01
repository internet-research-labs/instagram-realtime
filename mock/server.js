/**
 *
 *
 *
 */

var express = require('express');
var app     = express();
var nock    = require('nock');
var request = require('request');

nock('http://instagram.com')
  .persist()
  .get('/')
  .reply(200, 'fuck');

request.get('http://instagram.com/', function (err, resp, body) {
  console.log(body);
});

request.get('http://instagram.com/', function (err, resp, body) {
  console.log('>' + body);
});
