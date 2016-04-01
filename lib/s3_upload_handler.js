// Handles receiving a file, splitting it into multiple images, then uploading it to S3.

var os = require('os');
var fs = require('fs');
var tmp = require('tmp');
var path = require('path');
var AWS = require('aws-sdk');
var Busboy = require('busboy');
var FileType = require('file-type');
var ReadChunk = require('read-chunk');
var spawn = require('child_process').spawnSync;

var load_json = require('./load_json.js');
var Config = load_json('app/config.json');
var Creds = load_json('keys/aws.json');

// Request Handler
module.exports = function(req, res) {
  if (req.method == "DELETE") return req.on('data', function(d) {
    s3_delete(d.toString(), function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end();
    });
  });

  var errorMsg, fields = {};
  var tmpDir = tmp.dirSync({ prefix: 's3_upload-', unsafeCleanup: true });

  // Because busboy's "finish" callback is triggered before the write is actually finished.
  var finishedWriting = false;

  try {
    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      if (fieldname != 'file') {
        errorMsg = "Unexpected fieldname: "+fieldname; file.resume();
      } else if (fields.file) {
        errorMsg = "Duplicate fieldname: "+fieldname; file.resume();
      } else {
        fields.file = filename;
        var tf = fs.createWriteStream(path.join(tmpDir.name, 'original_file'))
        tf.on('finish', function() { finishedWriting = true; });
        file.pipe(tf);
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
        tmpDir.removeCallback(); // Delete all temp files.
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write("The request was improperly formatted: " + errorMsg);
        res.end();
      } else {
        //TODO: user authentication stuff....
        // Wait for the file to finish writing before continuing.
        var tid = setInterval(function() {
          if (!finishedWriting) return;
          clearInterval( tid );
          s3_upload(tmpDir.name, fields.folder +'/'+ fields.name, function() {
             //TODO: progress??
            tmpDir.removeCallback(); // Delete all temp files.
            res.writeHead(200, { 'Connection': 'close' });
            res.end();
          });
        }, 100); //TODO: timeout.
      }
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

// Helper functions
var s3_upload = function(dir, bucketpath, callback) {
  var bucket = new AWS.S3({params: {Bucket: Config['s3_bucket']}});
  var og_file = ReadChunk.sync(path.join(dir, 'original_file'), 0, 262);
  var type = FileType(og_file).ext;

  // Split file into images.
  switch (type) {
    // case 'msi': //TODO: ppt
    //   break;
    case 'pdf':
      var res = spawn('convert', [path.join(dir, 'original_file'), path.join(dir, 'i.png')])
      break;
    default:
      // Just upload the original_file.
  }

  //TODO: enable appending.
  // Upload whatever is in tmpDir.
  var list = fs.readdirSync(dir)
  console.log(list)

  if (list.length > 1) { // Remove 'original_file'.
    var i = list.indexOf('original_file');
    list.splice(i, 1);
  }

  var finishedUploading = [];

  for(var i in list) {
    console.log("Uploading:", list[i])
    var file = fs.createReadStream(path.join(dir, list[i]));
    var i = i.toString(); // needed in callbacks

    bucket.upload({
      Body: file,
      ACL: 'public-read',
      Key: bucketpath+'/'+list[i]
    }).
    on('httpUploadProgress', function(evt) { console.log(i, '==>', evt); }).
    send(function(err, data) { console.log(i, '==>', err, data); finishedUploading.push(i); });
  }

  // Wait for until finished uploading.
  var tid = setInterval(function() {
    if (finishedUploading.length == list.length) {
      clearInterval(tid);
      callback.call();
    }
  });
}

var s3_delete = function(path, callback) {
  var bucket = new AWS.S3({params: {Bucket: Config['s3_bucket']}});
  var objects = [];

  bucket.listObjects({Prefix: path+'/'}, function(err, data) {
    console.log("data", data)
    for (var i in data.Contents) {
      objects.push({Key: data.Contents[i].Key});
    }

    // Delete
    bucket.deleteObjects({Delete: {Objects: objects}}, function() {
      callback.call();
    });
  })
}
