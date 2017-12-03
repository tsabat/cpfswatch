var chai = require('chai');
var expect = chai.expect;
var App = require('../app');
var app = new App();
var fs = require('fs-extra');

describe('This shit works!', () => {
  beforeEach(() => {
    fs.emptyDirSync('source');
    fs.emptyDirSync('dest');

    app.start('./source', './dest');
  });

  afterEach(() => {
    // fs.removeSync('source');
    // fs.removeSync('dest');

    app.stop();
  });

  it('is cool', function(done) {
    // mocha likes us to timeout
    this.timeout(10000);

    fs.writeFileSync('source/burrito.txt', 'burrito');
    setTimeout(() => {
      expect(fs.readFileSync('dest/burrito.txt')).to.equal('burrito');
      console.log('waiting over.');
      done();
    }, 3000);
  });
});
