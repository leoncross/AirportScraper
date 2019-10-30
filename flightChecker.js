const fetch = require('node-fetch');
const cheerio = require('cheerio');

function Flight() {
  let flightDetails
  const gatwick = 'https://www.gatwickairport.com/flights/departures-results/?flight=';

  const getUrl = (code) => {
    if (code) {
      return gatwick
    }
  }

  const fetchFlightDetails = (url, code, callback) => {
    fetch(url + code)
      .then(res => res.text())
      .then(res => {
        const $ = cheerio.load(res)

        flightDetails = {
          time: $('#flight-results-listing > tr > td:nth-child(2)').html(),
          to: $('#flight-results-listing > tr > td:nth-child(3)').html(),
          code: $('#flight-results-listing > tr > td:nth-child(4)').html(),
          status: $('#flight-results-listing > tr > td.doorStop > span').html(),
          terminal: $('#flight-results-listing > tr > td:nth-child(6)').html(),
          gate: $('#flight-results-listing > tr > td.gateOpen').html().trim()
        }
        callback(flightDetails)
      })

  }

  this.getFlight = (code, callback) => {
    url = getUrl(code)
    fetchFlightDetails(url, code, callback)
  }
}

data = 'EJU8195'

flight = new Flight()
flight.getFlight(data, (flight) => {
  console.log(flight);
})
