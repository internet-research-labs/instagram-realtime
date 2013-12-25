/**
 * Routes Paths and Manages Subscription Triggers
 * ...
 */
function Router (params) {
  var self = this;
  self.parent = params.parent;
  self.server = params.server;
  self.client_id      = params.client_id;
  self.client_secret  = params.client_secret;
  self.callback_url   = params.callback_url;
}

Router.prototype.attach = function (server) {
}

module.exports = Router;
