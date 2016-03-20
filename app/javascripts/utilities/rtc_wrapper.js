
require('rtcmulticonnection-v3/dist/rmc3.js');

var presState;

//TODO: prevent admin-spoofing..

module.exports = {
  joinRoom: function() {
    this.connection = new RTCMultiConnection();
    this.connection.session = {data : true};

    this.connection.onopen = function(sess) {
      console.log("OPEN", sess);
      // if youre a presenter: wait to receive the state.
      // if youre the first admin: create the state, and send it.
      // if youre the second admin: wait to receive the state.
    }

    this.connection.onmessage = function(e) {
      console.log("MESSAGE:", e);
    }

    this.connection.openOrJoin('sunrun_foo_change_me_later');
  },
  leaveRoom: function() {
    if (this.connection) {
      this.connection.leave();
  }
}

document.rtc = module.exports; //TODO: remove
