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
    rd.on('error', err => done(err));

    const wr = fs.createWriteStream(target);
    wr.on('error', err => done(err));
    wr.on('close', () => done());
    rd.pipe(wr);

    function done(err) {
      if (!cbCalled) {
        cb(err);
        cbCalled = true;
      }
    }
  }

  rm(path) {
    console.log(`file delete started: ${path}`);
    const pathNoSource = this._removeSource(path);
    const newPath = this._prepended(pathNoSource);

    fs
      .unlink(newPath)
      .then(() => console.log(`file deleted: ${newPath}`))
      .catch(err => console.log(err));
  }

  cp(path) {
    const pathNoSource = this._removeSource(path);
    const newPath = this._prepended(pathNoSource);

    this.copyFile(path, newPath, (err) => {
      if (err) {
        return console.error(`error: ${err}`);
      }
      console.log(`copy file finished: ${newPath}`);
    });
  }

  mkdir(path) {
    console.log(`make dir started: ${path}`);
    const pathNoSource = this._removeSource(path);
    const newPath = this._prepended(pathNoSource);

    fs
      .ensureDir(newPath)
      .then(() => console.log(`dir created: ${newPath}`))
      .catch(err => console.error(err));
  }

  rmdir(path) {
    console.log(`rmdir started: ${path}`);
    const pathNoSource = this._removeSource(path);
    const newPath = this._prepended(pathNoSource);

    fs
      .remove(newPath)
      .then(() => console.log(`dir removed: ${newPath}`))
      .catch(err => console.log(err));
  }

  _removeSource(path) {
    return path.replace(`${this.source}/`, '');
  }

  _prepended(path) {
    return `${this.dest}/${path}`;
  }
}

module.exports = FileHelper;
