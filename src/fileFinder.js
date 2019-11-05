const gatwick = require('./airports/gatwick');
const heathrow = require('./airports/heathrow');

exports.getFile = airport => {
  // TODO: Add logic when multiple airports are accepted
  switch (airport) {
    case 'LGW':
      return gatwick;
    case 'LHR':
      return heathrow;
    default:
      return null;
  }
};
