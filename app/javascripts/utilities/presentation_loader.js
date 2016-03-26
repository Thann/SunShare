// Handles fetching the list of presentations.

var AppConfig = require('app/config');

// var listing_format_example = {
//   "folder_name1": {
//     "pres_name1": ["https://i.imgur.com/ZynM9HQ.jpg",
//                    "https://i.imgur.com/UcqFyTh.jpg"],
//     "pres_name2": ["url3", "url4"],
//   },
//   "folder_name2": {
//     "pres_name3": ["url5", "url6"],
//     "pres_name4": ["url7", "url8"],
//   }
// }

var master_list;
var url = window.location.protocol +'//s3.amazonaws.com/'+ AppConfig["s3_bucket"];

module.exports = {
  getList: function(callback) {
    $.ajax(url).success(function(data) {
      // build listing.
      var listing = {};
      $(data).find('Contents').each(function(i, entry) {
        var key = $(entry).find('Key').text().split('/');
        if (key.length === 3 && key[2] !== "") {
          var tmp = listing[key[0]]
          if (listing[key[0]] === undefined) listing[key[0]] = {};
          tmp = listing[key[0]];
          if (tmp[key[1]] === undefined) tmp[key[1]] = [];
          tmp[key[1]].push(url +'/'+ key.join('/'));
        }
      });
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