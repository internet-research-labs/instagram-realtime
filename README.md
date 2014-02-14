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

var InstagramStream = require('instagram-realtime');
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

## Methods

Brief description of functions

### subscribe

Subscribe to a hashtag:

```js
stream.subscribe({ tag : 'yolo' });
```

Subscribe to a geographic location:

```js
stream.subscribe({ lat:35.657872, lng:139.70232', radius:1000 });
```

Subscribe to a location by ID:

```js
stream.subscribe({ location : 2345 });
```

Subscribe to *all* users registered with the app:

```js
stream.subscribe({ user : true });
```

### unsubscribe

Unsubscribe from a stream:

```js
stream.unsubscribe();
```

### on

Register a trigger for unsubscription:

```js
stream.on('unsubscribe', function (response, body) {
}
stream.on('unsubscribe/error', function (error, response, body) {
}
```

Register a trigger for subscription:

```js
stream.on('subscribe', function (response, body) {
}
stream.on('subscribe/error', function (error, response, body) {
}
```

Register a trigger for new media:
```js
stream.on('new', function (response, body) {
}
stream.on('new/error', function (error, response, body) {
}
```

## TODO

1. Adjust function callbacks
2. Update docs

# License

MIT

# Author

Matt Razorblade Hammerstadt [@mattvvhat](https://twitter.com/mattvvhat)
