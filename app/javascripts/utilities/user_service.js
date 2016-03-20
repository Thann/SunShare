
// This is just a stub to be replaced by a SalesForce login.

module.exports = {
  init: function() {
    this.role = window.localStorage.getItem('SunShare_role') || 'client';
  },
  toggleAdmin: function() {
    if (this.role == 'client') {
      this.role = 'admin';
    } else {
      this.role = 'client';
    }
    window.localStorage.setItem('SunShare_role', this.role)
  }
}

module.exports.init();
