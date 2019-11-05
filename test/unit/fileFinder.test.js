const chai = require('chai');

const expect = chai.expect;

const FileFinder = require('../../src/fileFinder');
const gatwick = require('../../src/airports/gatwick');
const heathrow = require('../../src/airports/heathrow');

describe('FileFinder', () => {
  it('returns the gatwick file', () => {
    const file = FileFinder.getFile('LGW');

    expect(file).to.equal(gatwick);
  });

  it('returns the heathrow file', () => {
    const file = FileFinder.getFile('LHR');

    expect(file).to.equal(heathrow);
  });
  it('returns null if no airport defined', () => {
    const file = FileFinder.getFile();

    expect(file).to.equal(null);
  });
});
