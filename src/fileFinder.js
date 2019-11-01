const gatwick = require('./airports/gatwick');

exports.getFile = airport => {
  // TODO: Add logic when multiple airports are accepted
  if (airport) {
    return gatwick;
  }
  return null;
};
