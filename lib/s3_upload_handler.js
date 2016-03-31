// Handles receiving a file, splitting it into multiple images, then uploading it to S3.

var os = require('os');
var fs = require('fs');
var tmp = require('tmp');
var path = require('path');
var AWS = require('aws-sdk');
var Busboy = require('busboy');

var load_json = require('./load_json.js');
var Config = load_json('app/config.json');
var Creds = load_json('keys/aws.json');

// Request Handler
module.exports = function(req, res) {
  var errorMsg, fields = {};
  var tmpDir = tmp.dirSync({ prefix: 's3_upload-', unsafeCleanup: true });

  try {
    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      if (fieldname != 'file')
        errorMsg = "Unexpected fieldname: "+fieldname;
      else if (fields.file)
        errorMsg = "Duplicate fieldname: "+fieldname;
      else {
        fields.file = filename;
        file.pipe(fs.createWriteStream(path.join(tmpDir.name, 'original_file')))
      }
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      if (fieldname != 'name' && fieldname != 'folder')
        errorMsg = "Unexpected fieldname: "+fieldname;
      else if (fields[fieldname])
        errorMsg = "Duplicate fieldname: "+fieldname;
      else
        fields[fieldname] = val;
    });

    busboy.on('finish', function() {
      // Validate required fields.
      var requiredFields = ['name', 'folder', 'file'];
      for (var i in requiredFields) {
        if (!fields[requiredFields[i]]) errorMsg = "Missing required field: "+requiredFields[i];
      }

      if (errorMsg) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write("The request was improperly formatted: " + errorMsg);
      } else {
        //TODO: user authentication stuff....
        s3_upload(tmpDir.name, fields.folder +'/'+ fields.name);
        res.writeHead(200, { 'Connection': 'close' });
      }
      tmpDir.removeCallback(); // Delete all temp files.
      res.end();
    });

    return req.pipe(busboy);
  }

  catch (err) {
    console.error("S3_ERROR:", err.toString());

    tmpDir && tmpDir.removeCallback();
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write("A server error occurred while trying to process the request.");
    res.end();
  }
}

// Load Keys
if (Creds) {
  process.env.AWS_ACCESS_KEY_ID = Creds.id;
  process.env.AWS_SECRET_ACCESS_KEY = Creds.secret;
} else {
  console.warn("WARNING: No AWS Keys detected! file upload will not work...\n");
}

// Helper function
var s3_upload = function(dir, bucketpath) {
  var bucket = new AWS.S3({params: {Bucket: Config['s3_bucket']}});
  var file = fs.createReadStream(path.join(dir, 'original_file'));

  bucket.upload({
    Body: file,
    ACL: 'public-read',
    Key: bucketpath+'/001'
  }).
  on('httpUploadProgress', function(evt) { console.log(evt); }).
  send(function(err, data) { console.log(err, data) });
}
