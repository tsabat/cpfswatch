// LIKE TO PASS SHIT IN FROM CMD LINE
const FileHelper = require('./file_helper');
const chokidar = require('chokidar');

class App {
  stop() {
    this.watcher.close();
  }

  start(source, dest, done) {
    const fileHelper = new FileHelper(source, dest);
    const ignored = ['node_modules', 'tmp', /(^|[\/\\])\../];

    this.watcher = chokidar.watch(source, {
      ignored,
      ignoreInitial: true,
      persistent: true
    });

    // Add event listeners.
    this.watcher
      .on('add', path => fileHelper.cp(path))
      .on('unlink', path => fileHelper.rm(path))
      .on('change', (path, stats) => {
          // 'add', 'addDir' and 'change' events also receive stat() results as second
          // argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
          if (stats) console.log(`File ${path} changed size to ${stats.size}`);
          fileHelper.cp(path);
      })
      .on('addDir', path => fileHelper.mkdir(path))
      .on('unlinkDir', path => fileHelper.rmdir(path))
      .on('error', error => console.log(`Watcher error: ${error}`))
      .on('ready', () => {
          const watchedPaths = this.watcher.getWatched();
          console.log('watchedPaths: ', watchedPaths);
          console.log('Initial scan complete. Ready for changes.');
          done();
      });
  }
}

module.exports = App;
