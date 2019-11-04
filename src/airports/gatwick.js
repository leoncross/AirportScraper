const fetch = require('node-fetch');
const cheerio = require('cheerio');
// const fs = require('fs');

const gatwick = 'https://www.gatwickairport.com/flights/departures-results/?flight=';

const scrape = data => {
  const $ = cheerio.load(data);

  const flightDetails = {
    time: $('#flight-results-listing > tr > td:nth-child(2)').html(),
    to: $('#flight-results-listing > tr > td:nth-child(3)').html(),
    code: $('#flight-results-listing > tr > td:nth-child(4)').html(),
    status: $('#flight-results-listing > tr > td.doorStop > span').html(),
    terminal: $('#flight-results-listing > tr > td:nth-child(6)').html(),
    gate: $('#flight-results-listing > tr > td.gateOpen').html()
  };

  if (flightDetails.gate !== null) {
    flightDetails.gate = flightDetails.gate.trim();
  }
  return flightDetails;
};

module.exports.getFlightDetails = flightCode => {
  const url = gatwick + flightCode;
  return new Promise(resolve => {
    fetch(url)
      .then(data => data.text())
      .then(data => {
        // fs.writeFileSync('gatwickFlightNotFound.json', JSON.stringify(data))
        resolve(scrape(data));
      });
  });
};
