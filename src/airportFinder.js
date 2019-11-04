const gatwick = 'https://www.gatwickairport.com/flights/departures-results/?flight=';

exports.getUrl = (code, airportCode) => {
  // TODO: Add logic when multiple airports are accepted
  if (airportCode === 'LGW') {
    return gatwick + code;
  }
  return null;
};
