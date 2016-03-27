
require('stylesheets/layout.css');

var rivets = require('rivets');

var Viewer = require('views/viewer.js');
var Sidebar = require('views/sidebar.js');

var RTCWrapper = require('utilities/rtc_wrapper.js');
var PresLoader = require('utilities/presentation_loader.js');
var UserService = require('utilities/user_service.js');

module.exports = Backbone.View.extend({
  el: 'body',
  template: `
    <div id="header" rv-show="user.isAdmin">
      <div id="sidebarToggle" class="fa fa-bars"></div>
      <span>SunShare</span>
      <span>{ rtc.state.presentation }</span>
      <button id="stop" class="btn btn-default fa fa-stop" rv-show="rtc.state.presentation"></button>
      <button id="ping" class="btn btn-default fa fa-crosshairs" rv-class-active="capturePing" rv-show="rtc.state.presentation"></button>
    </div>
    <div id="main-row">
      <div id="left-side-bar" rv-show="user.isAdmin" rv-class-hidden="rtc.state.presentation">
        <div data-subview="sidebar"></div>
      </div>
      <div id="main-panel">
        <div id="waitingMsg" rv-hide="rtc.state.presentation">
          Waiting for presentation to start..
        </div>
        <div data-subview="viewer"></div>
      </div>
    </div>
    <!-- <div id="footer"></div> -->
  `,
  events: {
    'click #sidebarToggle': function() {
      this.$('#left-side-bar').toggleClass('hidden');
    },
    'click #stop': function(e) {
      RTCWrapper.state.presentation = null;
      RTCWrapper.syncState();
    },
    'click #ping': function(e) {
      this.scope.capturePing = !this.scope.capturePing;
      e.stopPropagation();
    },
    'click': function(e) {
      var target = $(e.target)
      var viewer = target.parents('#viewer');
      if (this.scope.capturePing && viewer.length > 0) {
        // Transmit ping
        var offset = viewer.offset();
        RTCWrapper.state.ping = {
          left: (e.pageX - offset.left) / viewer.width(),
          top: (e.pageY - offset.top) / viewer.height()
        };
        RTCWrapper.syncState();

        e.preventDefault();
        e.stopPropagation();
      }
      this.scope.capturePing = false;
    },
  },
  initialize: function() {
    Backbone.Subviews.add( this );
    this.scope.user = UserService;
    this.scope.rtc = RTCWrapper;
    //TODO: move
    RTCWrapper.joinRoom('sunrun_foo_change_me_later');
  },
  subviewCreators: {
    viewer: function() { return new Viewer(); },
    sidebar: function() { return new Sidebar(); },
  },
  render: function() {
    this.$el.html(this.template);
    rivets.bind(this.$el, this.scope);
    return this;
  },
  scope: {},
});
