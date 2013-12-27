# instagram-realtime

Event-based, object-oriented Instagram API wrapper for NodeJS

That is, program instagram-related things, using an event-driven framework.
Note that this adds middleware, which handles the Instagram API's subscription
verification.

## Minimal Example

```js
var app     = require('express')();
var colors  = require('colors');
var server  = require('http').createServer(app).listen(process.env.PORT || 5000);

var InstagramStream = require('../libs/InstagramStream.js');
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
```

# TODO

1. Adjust function callbacks
2. Update docs

# License

MIT

# Author

Matt Razorblade Hammerstadt [@mattvvhat](https://twitter.com/mattvvhat)
