require('backbone-subviews');
require('bootstrap/dist/js/bootstrap.js');
require('utilities/rivets_extensions.js');

var AppLayout = require('views/layout.js')

$(document).ready(function() {
  (new AppLayout).render();
});
