const chai = require('chai');

const AirportFinder = require('../../src/airportFinder');

const expect = chai.expect;

describe('AirportFinder', () => {
  it('returns an object with airport and url', () => {
    const gatwick = 'https://www.gatwickairport.com/flights/departures-results/?flight=';
    const code = 'EZY837';
    const airportCode = 'LGW';
    const url = AirportFinder.getUrl(code, airportCode);

    expect(url).to.equal(gatwick + code);
  });
  it('returns null when not LGW', () => {
    const code = 'EZY837';
    const airportCode = 'LAX';
    const url = AirportFinder.getUrl(code, airportCode);

    expect(url).to.equal(null);
  });
});
