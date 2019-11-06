const gatwick = require('./airports/gatwick');
const heathrow = require('./airports/heathrow');

const heathrowUrl = 'https://www.heathrow.com/departures/flight-details/';
const gatwickUrl = 'https://www.gatwickairport.com/flights/departures-results/?flight=';

exports.getFile = airport => {
  switch (airport) {
    case 'LGW':
      return { airport: gatwick, url: gatwickUrl, type: 'fetch' };
    case 'LHR':
      return { airport: heathrow, url: heathrowUrl, type: 'puppeteer' };
    default:
      return null;
  }
};
