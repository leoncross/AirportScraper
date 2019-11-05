const FileFinder = require('./fileFinder');

function Flight() {
  const returnFlightDetails = (flightDetails, callback) => {
    if (flightDetails.code === null) {
      callback(null);
    } else {
      callback(flightDetails);
    }
  };

  this.getFlight = async (flightCode, airportCode, callback) => {
    const airport = FileFinder.getFile(airportCode);
    const flightDetails = await airport.getFlightDetails(flightCode);
    returnFlightDetails(flightDetails, callback);
  };
}

module.exports = Flight;

//
// flight = new Flight()
//
// flight.getFlight('AA6728', 'LHR', (flightDetails) => {
//   console.log(flightDetails);
// })
