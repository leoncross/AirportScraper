const fetch = require('node-fetch');
const cheerio = require('cheerio');
// const fs = require('fs');

function Flight() {
  const gatwick = 'https://www.gatwickairport.com/flights/departures-results/?flight=';
  let flightDetails;

  const getUrl = () => gatwick;

  const handleReturnValue = callback => {
    if (flightDetails.code === null) {
      callback(null);
    } else {
      callback(flightDetails);
    }
  };

  const formatFlightDetails = res => {
    const $ = cheerio.load(res);
    flightDetails = {
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
  };

  const fetchFlightDetails = (url, code, callback) => {
    fetch(url + code)
      .then(res => res.text())
      .then(res => {
        // fs.writeFileSync('gatwickFlightNotFound.json', JSON.stringify(res))
        formatFlightDetails(res);
        handleReturnValue(callback);
      });
  };

  this.getFlight = (code, callback) => {
    const url = getUrl(code);

    fetchFlightDetails(url, code, callback);
  };
}

module.exports = Flight;
