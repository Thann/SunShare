
// This is just a stub to be replaced by a SalesForce login.

module.exports = {
  init: function() {
    this.isAdmin = (window.localStorage.getItem('SunShare_Admin') == 'true');
  },
  toggleAdmin: function() {
    this.isAdmin = !this.isAdmin;
    window.localStorage.setItem('SunShare_Admin', this.isAdmin? 'true' : 'false');
  }
}

module.exports.init();
