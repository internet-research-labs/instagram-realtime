# Getting Started with `instagram-realtime`

Ok

## Minimal Example

```js
var express = require('express');
var app     = express();
var ir      = require('instagram-realtime');
var stream  = new ir.Stream();

stream.on('subscribe', function (resp, body) {
  console.log('.-~* Subscribed to New Feed *~-.'.rainbow);
});

stream.on('unsubscribe', function (resp, body) {
  this.subscribe('yolo');
});

stream.on('new', function (resp, body) {
  console.log('New Media Arrived!'.green);
});

stream.unsubscribe_all();
```

## About

This wrapper allows the developer to rapidly prototype instagram in an
event-driven manner. That is, once a subscription has been made, all changes and
responses trigger events, rather than callbacks.

The available triggers are:
1. `subscribe`: Subscribe request succeeded.
2. `subscribe/error`: Subscribe request failed.
3. `unsubscribe`: Unsubscribe request succeeded.
4. `new`: New media was received successfully.
5. `error`: New media was received, but there was an issue. *Note*: This is
    expected to become a catch-all error-handler in future versions.

## Fin.

