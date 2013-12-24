# instagram-realtime

Event-based, object-oriented Instagram API wrapper for NodeJS

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

# License

MIT

# Author

Matt Razorblade Hammerstadt [@mattvvhat](https://twitter.com/mattvvhat)
