
require('rtcmulticonnection-v3/dist/rmc3.js');
var UserService = require('utilities/user_service.js');

//TODO: prevent admin-spoofing..

module.exports = {
  state: {},
  joinRoom: function() {
    this.connection = new RTCMultiConnection();
    this.connection.session = {data : true};

    this.connection.onopen = function(sess) {
      console.log("OPEN", sess);
    }

    this.connection.onmessage = function(e) {
      console.log("MESSAGE:", e);
      if (e.data.type == 'SyncState') {
        //TODO: this is probably dumb.
        this.state = e.data.data;
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
    syncState();
  },
}

// ===== private ======
var syncState = function() {
  this.connection.send({type: 'SyncState', data: this.state});
}

document.rtc = module.exports; //TODO: remove
