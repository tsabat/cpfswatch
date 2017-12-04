const fs = require('fs-extra');
const Q = require('q');
const chai = require('chai');
const expect = chai.expect;
const App = require('../app');

describe('App test', () => {
  const app = new App();
  const delay = 200; // ms

  beforeEach((done) => {
    fs.emptyDirSync('test/source');
    fs.emptyDirSync('test/dest');

    app.start('test/source', 'test/dest', done);
  });

  afterEach(() => {
    fs.removeSync('test/source');
    fs.removeSync('test/dest');

    app.stop();
  });

  it('should copy an added file', () => {
    const sourceFile = 'test/source/burrito.txt';
    const destFile = 'test/dest/burrito.txt';
    fs.writeFileSync(sourceFile, 'burrito');

    return Q.delay(delay)
      .then(() => {
        expect(fs.readFileSync(destFile, 'utf8')).to.equal('burrito');
      });
  });

  it('should copy a nested added file', () => {
    const sourceFile = 'test/source/nested/file/burrito.txt';
    const destFile = 'test/source/nested/file/burrito.txt';

    return fs.outputFile(sourceFile, 'burrito') // creates directory and file
      .then(() => Q.delay(delay))
      .then(() => {
        expect(fs.readFileSync(destFile, 'utf8')).to.equal('burrito');
      });
  });

  it('should replace contents of a changed file', () => {
    const sourceFile = 'test/source/burrito.txt';
    const destFile = 'test/dest/burrito.txt';

    return Q.ninvoke(fs, 'writeFile', sourceFile, 'burrito')
      .then(() => Q.delay(delay))
      .then(() => Q.ninvoke(fs, 'writeFile', sourceFile, 'updated'))
      .then(() => Q.delay(delay))
      .then(() => {
        expect(fs.readFileSync(destFile, 'utf8')).to.equal('updated');
      });
  });

  it('should remove a deleted file', () => {
    const sourceFile = 'test/source/burrito.txt';
    const destFile = 'test/dest/burrito.txt';

    return Q.ninvoke(fs, 'writeFile', sourceFile, 'burrito')
      .then(() => Q.delay(delay))
      .then(() => {
        expect(fs.existsSync(destFile)).to.equal(true);
      })
      .then(() => Q.invoke(fs, 'unlink', sourceFile))
      .then(() => Q.delay(delay))
      .then(() => {
        expect(fs.existsSync(destFile)).to.equal(false);
      });
  });

  it('should copy an added directory', () => {
    const sourceDir = 'test/source/newDir';
    const destDir = 'test/dest/newDir';

    return Q.ninvoke(fs, 'mkdir', sourceDir)
      .then(() => Q.delay(delay))
      .then(() => {
        expect(fs.existsSync(destDir)).to.equal(true);
      });
  });

  it('should remove a deleted directory', () => {
    const sourceDir = 'test/source/newDir';
    const destDir = 'test/dest/newDir';

    return Q.ninvoke(fs, 'mkdir', sourceDir)
      .then(() => Q.delay(delay))
      .then(() => Q.ninvoke(fs, 'rmdir', sourceDir))
      .then(() => Q.delay(delay))
      .then(() => {
        expect(fs.existsSync(destDir)).to.equal(false);
      });
  });

  it('should remove a deleted directory with files', () => {
    const sourceDir = 'test/source/newDir';
    const sourceFile = `${sourceDir}/burrito.txt`;
    const destDir = 'test/dest/newDir';

    return fs.outputFile(sourceFile, 'burrito') // creates directory and file
      .then(() => Q.delay(delay))
      .then(() => fs.remove(sourceDir))
      .then(() => Q.delay(delay))
      .then(() => {
        expect(fs.existsSync(destDir)).to.equal(false);
      });
  });
});
