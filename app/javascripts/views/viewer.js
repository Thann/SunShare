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
      <div id="ping" class="fa fa-circle-thin hidden"></div>
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
        self.renderPing(false);
      });
    },
    'click .carousel-indicators > li': function(e) {
      if (!(this.scope.user.isAdmin)) return;
      RTCWrapper.state.slide = $(e.currentTarget).data('slide-to');
      RTCWrapper.syncState();
      self.renderPing(false);
    },
  },
  initialize: function() {
    var self = this;
    RTCWrapper.onStateChange(function(prevState, state) {
      if (prevState.presentation != state.presentation) {
        PresLoader.getSlides(state.presentation, function(slides) {
          self.scope.slides = slides;
          self.render(); //TODO: why is a full render necessary? (the carousel doesnt load images otherwise)
        });
      } else if (prevState.slide != state.slide) {
        self.scope.state = state;
        self.$('#viewer').carousel(state.slide);
        self.renderPing(false);
      } else if (prevState.ping != state.ping) {
        self.renderPing(state.ping);
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
  renderPing: function(ping_state) {
    if (!ping_state) ping_state = {top: 0, left: -100}; // Render off screen.
    var viewer = this.$('#viewer .active img');
    var offset = parseInt(viewer.css('marginLeft'), 10); // for when the screen is wider than the image.
    var ping = this.$('#ping').removeClass('hidden');
    ping.css({
      top: (ping_state.top * viewer.height()) - (ping.height() / 2),
      left:(ping_state.left * viewer.width()) - (ping.width()  / 2) + offset
    });
    window.getComputedStyle(ping[0]); // Force opacity render.
    ping.addClass('hidden');
  },
  scope: {}
});
