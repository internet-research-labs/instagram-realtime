var app     = require('express')();
var server  = require('http').createServer(app);
var InstagramStream = require('../libs/InstagramStream.js');
var stream = InstagramStream(server);

server.listen(5000);

app.get('/', function (req, resp) {
  resp.end('___');
});
