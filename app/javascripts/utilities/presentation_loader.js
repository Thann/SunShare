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
var url = 'https://s3.amazonaws.com/'+ AppConfig["s3_bucket"];

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
  getSlides: function(path, callback) {
    var self = this;
    var tid = setInterval(function() {
      // Block return until getList has resolved once.
      if (master_list) {
        clearInterval(tid);
        if (!path) return callback.call(undefined, [])
        path = path.split('/');
        // Refresh the list if the presentation is not present.
        if (master_list[path[0]][path[1]]) {
          callback.call(undefined, master_list[path[0]][path[1]]);
        } else {
          self.getList(function(ml) {
            callback.call(undefined, ml[path[0]][path[1]]);
          });
        }
      }
    }, 100);
  },
  upload: function(options, callback) {
    // console.log("UPLOAD", path);
    $.ajax(_.extend({
        type: 'POST',
        url: "/s3_upload",
        cache: false,
        contentType: false,
        processData: false,
      }, options)
    ).then(callback);
  },
  delete: function(path, callback) {
    console.log("DELETE", path)
    $.ajax({
      type: 'DELETE',
      url: '/s3_upload',
      data: path,
    }).then(callback);
  }
}