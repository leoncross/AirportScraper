const cheerio = require('cheerio');

module.exports.scrape = data => {
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
