
// This is just a stub to be replaced by a SalesForce login.

module.exports = {
  init: function() {
    var self = this;
    $(window).on('hashchange', function() {
      self.isAdmin = (window.location.hash == '#admin')
    }).trigger('hashchange');
  },
  isAdmin: null,
}

module.exports.init();
