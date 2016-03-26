require('backbone-subviews');
require('bootstrap/dist/js/bootstrap.js');
require('utilities/rivets_extensions.js');

var AppLayout = require('views/layout.js');

// Init view when everything has loaded.
$(document).ready(function() {
  (new AppLayout()).render();
});

// Useful for testing; makes '$' available to the browser's inspector.
// require('expose?$!jquery');
