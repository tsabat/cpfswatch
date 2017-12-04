const fs = require('fs-extra');

class FileHelper {
  constructor(source, dest) {
    this.source = source;
    this.dest = dest;
  }

  // https://stackoverflow.com/a/14387791/182484
  copyFile(source, target, cb) {
    let cbCalled = false;

    const rd = fs.createReadStream(source);
    rd.on('error', function(err) {
      done(err);
    });
    const wr = fs.createWriteStream(target);
    wr.on('error', function(err) {
      done(err);
    });
    wr.on('close', function(ex) {
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

  rm(path) {
    const newPath = this._prepended(path);
    console.log('file delete started: ' + path);

    fs
      .unlink(newPath)
      .then(() => {
        console.log('file deleted: ' + newPath);
      })
      .catch(err => {
        console.log(err);
      });
  }

  cp(path) {
    console.log('copy file started: ' + path);
    const newPath = this._prepended(path);
    this.copyFile(path, newPath, function(err) {
      if (err) {
        return console.log('error!' + err);
      }
      console.log('copy file finished: ' + newPath);
    });
  }

  mkdir(path) {
    console.log('make dir started: ' + path);
    const newPath = this._prepended(path);

    fs
      .ensureDir(newPath)
      .then(() => {
        console.log('dir created: ' + newPath);
      })
      .catch(err => {
        console.error(err);
      });
  }

  rmdir(path) {
    console.log('rmdir started: ' + path);
    const newPath = this._prepended(path);

    fs
      .rmdir(newPath)
      .then(() => {
        console.log('dir removed: ' + newPath);
      })
      .catch(err => {
        console.log(err);
      });
  }

  _prepended(path) {
    return this.dest + '/' + path;
  }
}

module.exports = FileHelper;
