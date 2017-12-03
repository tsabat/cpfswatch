// LIKE TO PASS SHIT IN FROM CMD LINE
var FileHelper = require('./file_helper');
var chokidar = require('chokidar');

class App {
  stop() {
    this.watcher.close();
  }

  start(source, dest) {
    var fileHelper = new FileHelper(source, dest);

    console.log(source, dest);

    var ignored = ['node_modules', 'tmp', /(^|[\/\\])\../, './*.js'];
    this.watcher = chokidar.watch(source, {
      ignored: ignored,
      ignoreInitial: true,
      persistent: true
    });

    // Add event listeners.
    this.watcher
      .on('add', path => fileHelper.cp(path))
      .on('change', path => fileHelper.cp(path))
      .on('unlink', path => fileHelper.rm(path));

    // More possible events.
    this.watcher
      .on('addDir', path => fileHelper.mkdir(path))
      .on('unlinkDir', path => fileHelper.rmdir(path))
      .on('error', error => console.log(`Watcher error: ${error}`))
      .on('ready', () =>
        console.log('Initial scan complete. Ready for changes')
      );

    // 'add', 'addDir' and 'change' events also receive stat() results as second
    // argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
    this.watcher.on('change', (path, stats) => {
      if (stats) console.log(`File ${path} changed size to ${stats.size}`);
    });

    var watchedPaths = this.watcher.getWatched();
    console.log(watchedPaths);
  }
}

module.exports = App;
