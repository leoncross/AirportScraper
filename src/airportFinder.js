const gatwick = 'https://www.gatwickairport.com/flights/departures-results/?flight=';

exports.getUrl = code =>
  // TODO: Add logic when multiple airports are accepted

  ({ airport: 'gatwick', url: gatwick + code });
