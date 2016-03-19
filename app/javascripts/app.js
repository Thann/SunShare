require('backbone-subviews');
require('bootstrap/dist/js/bootstrap.js');

require('stylesheets/main.css');

var AppLayout = Backbone.View.extend({
  el: 'body',
  template: `
    Hello World
  `,
  render: function() {
    this.$el.html(this.template);
    return this;
  }
});

$(document).ready(function() {
  (new AppLayout).render();
});
