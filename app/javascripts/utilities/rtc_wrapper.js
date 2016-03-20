
require('rtcmulticonnection-v3/dist/rmc3.js');

var UserService = require('utilities/user_service.js');
var PresLoader = require('utilities/presentation_loader.js');

//TODO: prevent admin-spoofing..

module.exports = {
  state: {},
  joinRoom: function() {
    var self = this;
    this.connection = new RTCMultiConnection();
    this.connection.session = {data : true};

    this.connection.onopen = function(sess) {
      console.log("OPEN", sess);
    }

    this.connection.onmessage = function(e) {
      console.log("MESSAGE:", e);
      if (e.data.type == 'SyncState') {
        if (self.state.presentation != e.data.data.presentation){
          console.log("newPres");
          PresLoader.load(self.state.presentation)
        }
        //TODO: this is probably dumb.
        self.state = e.data.data;
      }
    }

    this.connection.openOrJoin('sunrun_foo_change_me_later');
  },
  leaveRoom: function() {
    if (this.connection) {
      this.connection.leave();
    }
  },
  selectPresentation: function(pres) {
    this.state.presentation = pres;
    PresLoader.load(pres)
    syncState();
  },
}

// ===== private ======
var self = module.exports;
var syncState = function() {
  self.connection.send({type: 'SyncState', data: self.state});
}

document.rtc = module.exports; //TODO: remove
