const fetch = require('node-fetch');
// const fs = require('fs');

const AirportFinder = require('./airportFinder');
const FileFinder = require('./fileFinder');

function Flight() {
  let flightDetails;

  const returnFlightDetails = callback => {
    if (flightDetails.code === null) {
      callback(null);
    } else {
      callback(flightDetails);
    }
  };

  const formatFlightDetails = (res, airportArg) => {
    const airport = FileFinder.getFile(airportArg);
    flightDetails = airport.scrape(res);
  };

  const fetchFlightDetails = (url, airport, callback) => {
    fetch(url)
      .then(res => res.text())
      .then(res => {
        // fs.writeFileSync('gatwickFlightNotFound.json', JSON.stringify(res))
        formatFlightDetails(res, airport);
        returnFlightDetails(callback);
      });
  };

  this.getFlight = (code, callback) => {
    const { airport, url } = AirportFinder.getUrl(code);
    fetchFlightDetails(url, airport, callback);
  };
}

module.exports = Flight;
