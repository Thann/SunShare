
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
      <button id="stop" rv-show="rtc.state.presentation" class="btn btn-default fa fa-stop"></button>
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
  `,
  events: {
    'click #stop': function(e) {
      RTCWrapper.state.presentation = null;
      RTCWrapper.syncState(true);
    },
    'click #sidebarToggle': function() {
      this.$('#left-side-bar').toggleClass('hidden');
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
