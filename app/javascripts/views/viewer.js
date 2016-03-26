// A glorified wrapper for bootstrap carousel.

require('stylesheets/viewer.css');

var rivets = require('rivets');
var RTCWrapper = require('utilities/rtc_wrapper.js');
var PresLoader = require('utilities/presentation_loader.js');
var UserService = require('utilities/user_service.js');

module.exports = Backbone.View.extend({
  template: `
    <div id="viewer" class="carousel slide" rv-show="slides | length | gt 0">
      <!-- Indicators -->
      <ol class="carousel-indicators" rv-show="user.isAdmin">
        <li rv-each-item="slides" rv-data-slide-to="index" data-target="#viewer"></li>
      </ol>

      <!-- Wrapper for slides -->
      <div class="carousel-inner" role="listbox">
        <div rv-each-url="slides" class="item">
          <img rv-src="url" alt="...">
        </div>
      </div>

      <!-- Controls -->
      <a class="left carousel-control" rv-show="user.isAdmin" href="#viewer" role="button" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" rv-show="user.isAdmin" href="#viewer" role="button" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  `,
  events: {
    'click .carousel-control': function(e) {
      if (!(this.scope.user.isAdmin)) return;
      var self = this;
      var dir = this.$(e.currentTarget).data('slide');
      setTimeout(function() {
        var cur = $('.carousel-inner > .item.'+dir).index('.item');
        RTCWrapper.state.slide = cur;
        RTCWrapper.syncState();
      });
    },
    'click .carousel-indicators > li': function(e) {
      if (!(this.scope.user.isAdmin)) return;
      RTCWrapper.state.slide = $(e.currentTarget).data('slide-to');
      RTCWrapper.syncState();
    },
  },
  initialize: function() {
    var self = this;
    RTCWrapper.onStateChange(function(prevState, state) {
      if (prevState.presentation != state.presentation) {
        self.scope.slides = PresLoader.getSlides(state.presentation);
        self.render(); //TODO: why is this necessary?
      } else if (prevState.slide != state.slide) {
        self.scope.state = state;
        self.$('#viewer').carousel(state.slide);
      }
    });
  },
  render: function() {
    this.scope.state = RTCWrapper.state;
    this.scope.user = UserService;

    this.$el.html(this.template);
    rivets.bind(this.$el, this.scope);

    // Make the proper slide active.
    var active = this.scope.state.slide || 0;
    this.$('.item').eq(active).addClass('active');
    this.$('.carousel-indicators > li').eq(active).addClass('active');

    // Prevent autoslide.
    this.$('#viewer').carousel({ interval: false });

    return this;
  },
  scope: {}
});
