require('backbone-subviews');

require('stylesheets/layout.css');

var rivets = require('rivets');
var Viewer = require('views/viewer.js');
var RTCWrapper = require('utilities/rtc_wrapper.js');
var UserService = require('utilities/user_service.js');

module.exports = Backbone.View.extend({
  el: 'body',
  template: `
    <div id="header"></div>
    <button id="toggle" class="btn btn-default">
      <span rv-show="user.isAdmin">Admin</span>
      <span rv-hide="user.isAdmin">Client</span>
    </button>
    <button id="stop" rv-show="user.isAdmin | and state.presentation" class="btn btn-default">STOP</button>
    <div rv-hide="state.presentation">
      <button id="start" rv-show="user.isAdmin">START</button>
      Waiting for presentation to start..
    </div>
    <div data-subview="viewer"></div>
    <div id="footer"></div>
  `,
  events: {
    'click button#toggle': function(e) {
      UserService.toggleAdmin();
    },
    'click button#start': function(e) {
      RTCWrapper.selectPresentation('theonlyone');
    },
    'click button#stop': function(e) {
      RTCWrapper.selectPresentation();
    },
  },
  initialize: function() {
    Backbone.Subviews.add( this );
    this.scope.user = UserService;
    this.scope.state = RTCWrapper.state;
    //TODO: move
    RTCWrapper.joinRoom();
  },
  subviewCreators: {
    viewer: function() { return new Viewer },
  },
  render: function() {
    this.$el.html(this.template);
    var rvo = rivets.bind(this.$el, this.scope);
    return this;
  },
  scope: {},
});
