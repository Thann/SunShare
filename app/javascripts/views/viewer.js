// A glorified wrapper for bootstrap carousel.

require('stylesheets/viewer.css');

var rivets = require('rivets');
var RTCWrapper = require('utilities/rtc_wrapper.js');
var PresLoader = require('utilities/presentation_loader.js');

module.exports = Backbone.View.extend({
  template: `
    <div id="viewer" class="carousel slide" rv-if="pres.slides | length | gt 0">
      <!-- Indicators -->
      <ol class="carousel-indicators">
        <li rv-each-item="pres.slides" data-target="#viewer" rv-data-slide-to="index"></li>
      </ol>

      <!-- Wrapper for slides -->
      <div class="carousel-inner" role="listbox">
        <div rv-each-item="pres.slides" class="item">
          <img rv-src="item.img" alt="...">
          <div class="carousel-caption">{ item.caption }</div>
          { item.text }
        </div>
      </div>

      <!-- Controls -->
      <a class="left carousel-control" href="#viewer" role="button" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" href="#viewer" role="button" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  `,
  events: {
    'click .carousel-control': function(e) {
      var self = this;
      var dir = this.$(e.currentTarget).data('slide');
      setTimeout(function() {
        var cur = $('.carousel-inner > .item.'+dir).index('.item');
        RTCWrapper.state.slide = cur;
        RTCWrapper.syncState();
      });
    },
    // 'click .carousel-indicators': function(e) {
    // },
  },
  initialize: function() {
    var self = this;
    PresLoader.onload = function() { self.render(); };
    RTCWrapper.onStateChange(function(prevState, state) {
      if (prevState.presentation != state.presentation) {
        PresLoader.load(state.presentation);
      } else if (prevState.slide != state.slide) {
        self.scope.state = state;
        self.$('#viewer').carousel(state.slide);
      }
    });
  },
  render: function() {
    this.scope.pres = PresLoader;
    this.scope.state = RTCWrapper.state;
    this.$el.html(this.template);
    rivets.bind(this.$el, this.scope);

    // Make the proper one active
    var active = this.scope.state.slide || 0;
    this.$('.item').eq(active).addClass('active');
    this.$('.carousel-indicators > li').eq(active).addClass('active');

    // Prevent autoslide
    this.$('#viewer').carousel({ interval: false });

    return this;
  },
  scope: {}
});
