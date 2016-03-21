
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
      console.log("INIT?", self.connection.isInitiator)
      if (self.connection.isInitiator) {
        syncState();
      }
    }

    this.connection.onmessage = function(e) {
      console.log("MESSAGE:", e);
      if (e.data.type == 'SyncState') {
        if (self.state.presentation != e.data.data.presentation){
          PresLoader.load(self.state.presentation);
          self.state.presentation = e.data.data.presentation;
        }
        if (self.state.slide != e.data.data.slide) {
          self.state.slide = e.data.data.slide;
          PresLoader.onchange() //TODO: bad
        }
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
    this.state.slide = 0;
    PresLoader.load(pres)
    syncState();
  },
  selectSlide: function(num) {
    this.state.slide = num;
    // console.log('SSSSS', num)
    syncState();
  },
}

// ===== private ======
var self = module.exports;
var syncState = function() {
  self.connection.send({type: 'SyncState', data: self.state});
}

document.rtc = module.exports; //TODO: remove
