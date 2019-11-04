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

  const fetchFlightDetails = (url, airport, callback) => {
    fetch(url)
      .then(data => data.text())
      .then(data => {
        // fs.writeFileSync('gatwickFlightNotFound.json', JSON.stringify(data))
        flightDetails = airport.scrape(data);
        returnFlightDetails(callback);
      });
  };

  this.getFlight = (flightCode, airportCode, callback) => {
    const url = AirportFinder.getUrl(flightCode, airportCode);
    const airport = FileFinder.getFile(airportCode);
    fetchFlightDetails(url, airport, callback);
  };
}

module.exports = Flight;
