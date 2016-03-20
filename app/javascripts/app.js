require('backbone-subviews');
require('bootstrap/dist/js/bootstrap.js');

require('stylesheets/main.css');

var rivets = require('rivets');
var Viewer = require('views/viewer.js');
var RTCWrapper = require('utilities/rtc_wrapper.js');
var UserService = require('utilities/user_service.js');

var AppLayout = Backbone.View.extend({
  el: 'body',
  template: `
    <div id="header"></div>
    <button class="btn btn-default">{ user.role }</button>
    <div data-subview="viewer"></div>
    <div id="footer"></div>
  `,
  events: {
    'click button': function(e) {
      UserService.toggleAdmin();
    }
  },
  initialize: function() {
    Backbone.Subviews.add( this );
    this.scope.user = UserService;
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

$(document).ready(function() {
  (new AppLayout).render();
});
