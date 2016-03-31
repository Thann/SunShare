// Stupid little module to easily load json w/ comments.

var fs = require('fs');
var path = require('path');
var strip = require('strip-json-comments');

module.exports = function(path_str) {
  try {
    var str = fs.readFileSync(path_str, 'utf-8');
  }
  catch (err) {
    if (err.code === 'ENOENT') return undefined;
    else throw err
  }
  return JSON.parse(strip(str));
};