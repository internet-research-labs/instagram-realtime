var express = require('express');
var ir      = require('instagram-realtime');
var app     = express();

var stream = new ir.Stream();

stream.on('subscribe', function () {
});

stream.on('unsubscribe', function () {
});

stream.on('new', function () {
});

stream.on('error', function () {
});

stream.subscribe({ user : true });
stream.subscribe({ tag : 'yolo' });
stream.subscribe({ location : 1257285 });
stream.subscribe({ lng : 10, lat : -100, radius : 1000 });
