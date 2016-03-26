// Handles fetching the list of presentations.

var AppConfig = require('app/config');

var new_dummy = {
  "folder_name1": {
    "pres_name1": ["https://i.imgur.com/ZynM9HQ.jpg",
                   "https://i.imgur.com/UcqFyTh.jpg"],
    "pres_name2": ["url3", "url4"],
  },
  "folder_name2": {
    "pres_name3": ["url5", "url6"],
    "pres_name4": ["url7", "url8"],
  }
}

var master_list;

module.exports = {
  getList: function(callback) {
    $.ajax(window.location.protocol +'//s3.amazonaws.com/'+ AppConfig["s3_bucket"]).success(function(data) {
      //TODO: build listing.
      // console.log("AWS:", data.toString())
      // console.log("XXX:", $(data).find('Contents'))
      // console.log("JSON:", $.parseXML(data))
      var listing = {};
      $(data).find('Contents').each(function(i, entry) {
        // console.log("EE",$(entry).find('Key').text())
      });

      listing = new_dummy;

      master_list = listing;
      callback.call(null, listing);
    });
  },
  getSlides: function(path) {
    if (!path) return null;
    path = path.split('/');
    return master_list[path[0]][path[1]];
  }
}