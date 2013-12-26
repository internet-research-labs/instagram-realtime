var colors  = require('colors');
var server  = require('http').createServer(function (req, resp) {
  resp.writeHeader(200, { 'Content-Type' : 'text/html; charset=utf-8' });
  resp.end(
    '<body><div id="vvhat"></div>'                                      +
    '<script src="/socket.io/socket.io.js"></script><script>'           +
    'var socket = io.connect("http://iriririr.jit.su:80");'             +
    'var vvhat = document.getElementById("vvhat");                    ' +
    'socket.on("connect", function () { console.log("connected"); });'  +
    'socket.on("new", function (body) { console.log("@@@"); vvhat.innerHTML = body + "<br>" + vvhat.innerHTML; });'   +
    '</script></body>'
  );
}).listen(process.env.PORT || 5000);

var io              = require('socket.io').listen(server, { log : false })
var InstagramStream = require('../libs/InstagramStream.js');
var secrets         = require('./secrets.json');

var stream = InstagramStream(
  server,
  {
    client_id     : secrets.client_id,
    client_secret : secrets.client_secret,
    url           : secrets.url,
    callback_path : 'callback'
  }
);

console.log('instagram-realtime: '.rainbow + 'socket.io');
console.log('@: '.blue + new Date());

stream.on('unsubscribe', function (req, body) {
  console.log('unsubscribe'.green);
  stream.subscribe({ tag : 'yolo' });
});

stream.on('unsubscribe/error', function (error, req, body) {
  console.log('unsubscribe/error:'.red + error);
});

stream.on('subscribe', function (req, body) {
  console.log('subscribe'.green);
});

stream.on('subscribe/error', function (error, req, resp) {
  console.log('subscribe/error: '.red + error);
  console.log(resp);
});

stream.on('new', function (req, body) {
  io.sockets.emit('new', JSON.stringify(body));
});

stream.on('new/error', function (error, req, body) {
  console.log('new/error: '.red + error);
});

stream.unsubscribe('all');
