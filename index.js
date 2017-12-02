var chokidar = require('chokidar');
var fs = require('fs-extra');
var ignored = ['node_modules', 'tmp', /(^|[\/\\])\../, 'index.js'];

// the path we'll be syncing to
var prepend = 'tmp'

var watcher = chokidar.watch('.', {
  ignored: ignored,
  ignoreInitial: true,
  persistent: true
});

function createNewPath(path) {
  return prepend + '/' + path;
}

// https://stackoverflow.com/a/14387791/182484
function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function (err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function (err) {
    done(err);
  });
  wr.on("close", function (ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

// Something to use when events are received.
var log = console.log.bind(console);

var rm = function (path) {
  var newPath = createNewPath(path);
  console.log('file delete started: ' + path);

  fs.unlink(newPath)
    .then(() => {
      console.log('file deleted: ' + newPath)
    })
    .catch(err => {
      console.log(err)
    })
}

var cp = function (path) {
  console.log('copy file started: ' + path);
  var newPath = createNewPath(path);
  copyFile(path, newPath, function (err) {
    if (err) {
      return console.log('error!' + err)
    }
    console.log('copy file finished: ' + newPath)
  });
};

var mkdir = function (path) {
  console.log('make dir started: ' + path);
  var newPath = createNewPath(path);

  fs.ensureDir(newPath)
    .then(() => {
      console.log('dir created: ' + newPath)
    })
    .catch(err => {
      console.error(err)
    })
};

var rmdir = function (path) {
  console.log('remove dir ' + path);
};

// Add event listeners.
watcher
  .on('add', path => cp(path))
  .on('change', path => cp(path))
  .on('unlink', path => rm(path));

// More possible events.
watcher
  .on('addDir', path => mkdir(path))
  .on('unlinkDir', path => rmdir(path))
  .on('error', error => log(`Watcher error: ${error}`))
  .on('ready', () => log('Initial scan complete. Ready for changes'));

// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', (path, stats) => {
  if (stats) console.log(`File ${path} changed size to ${stats.size}`);
});

var watchedPaths = watcher.getWatched();
console.log(watchedPaths);