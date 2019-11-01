const chai = require('chai');
const gatwick = require('../../src/airports/gatwick');

const FileFinder = require('../../src/fileFinder');

const expect = chai.expect;

describe('fileFinder', () => {
  it('returns the gatwick file', () => {
    const file = FileFinder.getFile('gatwick');

    expect(file).to.equal(gatwick);
  });
  it('returns null if no airport defined', () => {
    const file = FileFinder.getFile();

    expect(file).to.equal(null);
  });
});
