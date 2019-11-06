const chai = require('chai');

const expect = chai.expect;

const FileFinder = require('../../src/fileFinder');

const gatwick = require('../../src/airports/gatwick');
const heathrow = require('../../src/airports/heathrow');

const heathrowUrl = 'https://www.heathrow.com/departures/flight-details/';
const gatwickUrl = 'https://www.gatwickairport.com/flights/departures-results/?flight=';

describe('File Finder', () => {
  it('returns the gatwick file', () => {
    const file = FileFinder.getFile('LGW');

    expect(file).to.deep.equal({ airport: gatwick, url: gatwickUrl, type: 'fetch' });
  });

  it('returns the heathrow file', () => {
    const file = FileFinder.getFile('LHR');

    expect(file).to.deep.equal({ airport: heathrow, url: heathrowUrl, type: 'puppeteer' });
  });
  it('returns null if no airport defined', () => {
    const file = FileFinder.getFile();

    expect(file).to.equal(null);
  });
});
