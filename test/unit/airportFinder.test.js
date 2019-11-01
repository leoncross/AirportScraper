const chai = require('chai');

const AirportFinder = require('../../src/airportFinder');

const expect = chai.expect;

describe('AirportFinder', () => {
  it('returns an object with airport and url', () => {
    const gatwick = 'https://www.gatwickairport.com/flights/departures-results/?flight=';
    const code = 'EZY837';
    const url = AirportFinder.getUrl(code);

    expect(url).to.deep.equal({ airport: 'gatwick', url: gatwick + code });
  });
});
