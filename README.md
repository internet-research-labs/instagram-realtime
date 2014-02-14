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

# How-to

## Standard Events

There are 3 events:
1. `subscribe`
2. `unsubscribe`
3. `new`

Their callback is:
```js
function (req, resp) { /* code */ }
```

1. `req`: a request object returned by the `http` package
2. `resp`: a response object used by the `http` package

## Error Events

There are 3 error events:
1. `subscribe/error`
2. `unsubscribe/error`
3. `new/error`

Their callback is:
```js
function (error, req, resp) { /* code */ }
```

1. `error`: an error string returned by the `request` package
2. `req`: a request object returned by the `http` package
3. `resp`: a response object used by the `http` package

## Methods

Brief description of functions

### subscribe

Subscribe to a hashtag:
```stream.subscribe({ tag : 'yolo' });```

Subscribe to a geographic location:
```stream.subscribe({ lat:35.657872, lng:139.70232', radius:1000 });```

Subscribe to a location by ID:
```stream.subscribe({ location : 2345 });```

Subscribe to *all* users registered with the app:
```stream.subscribe({ user : true });```

### unsubscribe

Unsubscribe from a stream:
```stream.unsubscribe();```

### on

Register a trigger for unsubscription:
```js
// On unsubscribe success
stream.on('unsubscribe', function (response, body) {
  // ...
}
// On unsubscribe error
stream.on('unsubscribe/error', function (error, response, body) {
  // ...
}
```

Register a trigger for subscription:
```js
// On subscribe success
stream.on('subscribe', function (response, body) {
  // ...
}
// On subscribe error
stream.on('subscribe/error', function (error, response, body) {
  // ...
}
```

Register a trigger for new media:
```js
// On new media received success
stream.on('new', function (response, body) {
  // ...
}
// On new media error
stream.on('new/error', function (error, response, body) {
  // ...
}
```

## TODO

1. Adjust function callbacks
2. Update docs

# License

MIT

# Author

Matt Razorblade Hammerstadt [@mattvvhat](https://twitter.com/mattvvhat)
