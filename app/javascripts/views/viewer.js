require('stylesheets/viewer.css');

var rivets = require('rivets');

module.exports = Backbone.View.extend({
  template: `
    <div id="viewer" class="carousel slide">
      <!-- Indicators -->
      <ol class="carousel-indicators">
        <li rv-each-item="slides" data-target="#viewer" rv-data-slide-to="index"></li>
      </ol>

      <!-- Wrapper for slides -->
      <div class="carousel-inner" role="listbox">
        <div rv-each-item="slides" class="item">
          <img src="..." alt="...">
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
  render: function(){
    this.$el.html(this.template);
    this.scope.slides = [
      {color: 'red', text: 'jon'},
      {color: 'black', text: 'charles'},
    ]
    var rvo = rivets.bind(this.$el, this.scope)

    // Make the first one active
    this.$('.item').first().addClass('active');
    this.$('.carousel-indicators > li').first().addClass('active');

    // Prevent autoslide
    this.$('#viewer').carousel({
      interval: false,
    });

    return this;
  },
  scope: {}
});

// =======

rivets.binders.color = function(el, value) {
  el.style['background-color'] = value
}
