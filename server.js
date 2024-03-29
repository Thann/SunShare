// Mostly copied from github.com/muaz-khan/RTCMultiConnection/server.js

// Serves up index.html, dist/*, and socket.io

var allowedDir = "/dist/"; // Only allow access to files that begin with this..

var options = { // defaults
  http: false,
  ip: "0.0.0.0",
  port: 9001,
}

var opt = require("node-getopt").create([
  ['', 'http', 'Disable SSL'],
  ['', 'ip=ARG', 'Set IP'],
  ['', 'port=ARG', 'Set port'],
  ['', 'watch', 'Recompile assets on file modification'],
  ['h', 'help', '']
]).bindHelp().parseSystem()

// Merge opts into options
for (var attrname in opt.options) { options[attrname] = opt.options[attrname]; }

// Init vars
var server = require(options.http ? 'http' : 'https'),
  url = require('url'),
  path = require('path'),
  fs = require('fs');

var s3_upload_handler = require('./lib/s3_upload_handler.js');

function serverHandler(request, response) {
  var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd(), uri);


  // Parse and handle the route.
  if (uri == '/') {
    filename = "index.html";

    // HTTP Strict Transport Security. (keep using SSL for at least a year)
    if (!options.http)
      response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  else if (uri == '/s3_upload') return s3_upload_handler(request, response);
  else if (uri.indexOf(allowedDir) !== 0) {
    filename = '';
    response.writeHead(403, {
      'Content-Type': 'text/plain'
    });
    response.write('403 Forbidden: Only certain paths are allowed. \n');
    response.end();
    return;
  }

  var stats;

  try {
    stats = fs.lstatSync(filename);
  } catch (e) {
    response.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    response.write('404 Not Found: ' + path.join('/', uri) + '\n');
    response.end();
    return;
  }

  fs.readFile(filename, 'binary', function(err, file) {
    if (err) {
      response.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      response.write('500 File Error: ' + path.join('/', uri) + '\n');
      response.end();
      return;
    }

    response.writeHead(200);
    response.write(file, 'binary');
    response.end();
  });
}

var app;

if (!options.http) {
  try {
    var opts = {
      key: fs.readFileSync(path.join(__dirname, 'keys/privatekey.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'keys/certificate.pem'))
    };
  }
  catch (err) {
    console.warn("WARNING: failed to find valid SSL keys, falling back to fake-keys..");
    var opts = {
      key: fs.readFileSync(path.join(__dirname, 'node_modules/rtcmulticonnection-v3/fake-keys/privatekey.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'node_modules/rtcmulticonnection-v3/fake-keys/certificate.pem'))
    };
  }

  // Setup HTTP-redirect server.
  require('http').createServer(function(req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).on('error', function(err) {
    console.warn("WARNING: unable to start http-redirect server. GOT:", err.toString());
  }).listen(80);

  app = server.createServer(opts, serverHandler);
} else app = server.createServer(serverHandler);

app = app.listen(options.port, options.ip, function() {
  var addr = app.address();
  console.log("Server listening at", (options.http ? "http://" : "https://" ) + addr.address + ":" + addr.port);
});

app.on('error', function(err) {
  console.log('ServerError:', err.code)
})

// === socket.io signaling server ===
require('rtcmulticonnection-v3/Signaling-Server.js')(app, function(socket) {
  try {
    var params = socket.handshake.query;

    // "socket" object is totally in your own hands!
    // do whatever you want!

    // in your HTML page, you can access socket as following:
    // connection.socketCustomEvent = 'custom-message';
    // var socket = connection.getSocket();
    // socket.emit(connection.socketCustomEvent, { test: true });

    if (!params.socketCustomEvent) {
      params.socketCustomEvent = 'custom-message';
    }

    socket.on(params.socketCustomEvent, function(message) {
      try {
        socket.broadcast.emit(params.socketCustomEvent, message);
      } catch (e) {}
    });
  } catch (e) {}
});

// === Watch ===
if (options.watch) {
  var watcher = require('child_process').spawn('webpack', ['--watch', '--colors']);

  watcher.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  watcher.stderr.on('data', function(data) {
    console.log(data.toString());
  });
}
