require('backbone-subviews');
require('bootstrap/dist/js/bootstrap.js');

require('stylesheets/main.css');

var Viewer = require('views/viewer.js');

var AppLayout = Backbone.View.extend({
  el: 'body',
  template: `
    <div id="header"></div>
    <div data-subview="viewer"></div>
    <div id="footer"></div>
  `,
  initialize: function() {
    Backbone.Subviews.add( this );
  },
  subviewCreators: {
    viewer: function() { return new Viewer },
  },
  render: function() {
    this.$el.html(this.template);
    return this;
  }
});

$(document).ready(function() {
  (new AppLayout).render();
});
