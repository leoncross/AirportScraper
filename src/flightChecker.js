const FileFinder = require('./fileFinder');
const RequestHandler = require('./requestHandler');

function Flight() {
  const returnFlightDetails = (flightDetails, callback) => {
    if (flightDetails.code === null) {
      callback(null);
    } else {
      callback(flightDetails);
    }
  };

  this.getFlight = async (flightCode, airportCode, callback) => {
    const { airport, url, type } = FileFinder.getFile(airportCode);
    const flightDetails = await RequestHandler.getData(type, url, flightCode, airport);
    returnFlightDetails(flightDetails, callback);
  };
}

module.exports = Flight;

// flight = new Flight();
//
// // flight.getFlight('BA2762', 'LGW', flightDetails => {
// //   console.log(flightDetails);
// // });
// flight.getFlight('AA6728', 'LHR', flightDetails => {
//   console.log(flightDetails);
// });
