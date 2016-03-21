
require('rtcmulticonnection-v3/dist/rmc3.js');

var UserService = require('utilities/user_service.js');
var PresLoader = require('utilities/presentation_loader.js');

//TODO: prevent admin-spoofing..

module.exports = {
  joinRoom: function(room) {
    var self = this;
    this.connection = new RTCMultiConnection();
    this.connection.session = {data : true};

    this.connection.onopen = function(sess) {
      console.log("OPEN", sess);
      // The Initiator is responsible for sending the state.
      if (self.connection.isInitiator) { self.syncState(); }
    }

    this.connection.onmessage = function(e) {
      console.log("MESSAGE:", e);
      if (e.data.type == 'SyncState') {
        self.state = e.data.data; //TODO: don't do functions.
        self.triggerStateChange();
      }
    }

    this.connection.openOrJoin(room);
  },
  leaveRoom: function() {
    if (this.connection) {
      this.connection.leave();
    }
  },
  state: {},
  onStateChange: function(fn) { // Register a handler
    if (typeof fn !== 'function') throw "Must pass a function!";
    stateChangeHandlers.push(fn);
  },
  triggerStateChange: function() { // Trigger handlers
    var originalState = _.clone(this.state);
    var self = this;
    _.forEach(stateChangeHandlers, function(fn) {
      fn.call(self, oldState, self.state);
    });
    oldState = originalState;
  },
  syncState: function() {
    this.connection.send({type: 'SyncState', data: this.state});
  },
}

// === private ===
var oldState = {};
var stateChangeHandlers = [];
