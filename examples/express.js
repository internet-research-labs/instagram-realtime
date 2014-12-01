var app     = require('express')();
var colors  = require('colors');
var server  = require('http').createServer(app).listen(process.env.PORT || 5000);

var InstagramStream = require('../src/InstagramStream.js');
var secrets = require('./secrets.json');

var stream = InstagramStream(
  server,
  {
    client_id     : secrets.client_id,
    client_secret : secrets.client_secret,
    url           : secrets.url,
    callback_path : 'callback'
  }
);

stream.on('unsubscribe', function (req, resp) {
  console.log('unsubscribe'.green);
  stream.subscribe({ tag : 'yolo' });
});

stream.on('new', function (req, body) {
  console.log(body);
});

app.get('/', function (req, resp) {
  resp.set('Content-Type', 'text/plain; charset=utf-8');
  resp.end('🍕🏊');
});

stream.unsubscribe('all');
