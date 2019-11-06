// const fs = require('fs');

module.exports.scrape = async page =>
  page.evaluate(
    /* istanbul ignore next */

    () => {
      const flightDetails = {
        time: document.querySelector(
          '#flightStatusID > ul > li:nth-child(1) > span.flight-details__scheduled-time'
        ).innerText,
        to: document.querySelector(
          '#flightdetails > section.src-dest.small-12.columns > div.plane-details > div.dest > span'
        ).innerText,
        code: document
          .querySelector('#flightdetails > section.flightdetails.small-12.columns > h1')
          .innerText.split(' ')
          .splice(-1)[0],
        status: document
          .querySelector('#flightStatusID > ul > li:nth-child(2) > span.flight-details__status')
          .innerText.split(/\n/g)[0],
        terminal: document.querySelector(
          '#flightStatusID > ul > li:nth-child(3) > span.flight-details__terminal'
        ).innerText
      };

      const gate = document.querySelector(
        '#flightStatusID > ul > li:nth-child(2) > span.flight-details__status > span'
      );

      if (gate) {
        flightDetails.gate = gate.innerText.split(' ').splice(-1)[0];
      } else {
        flightDetails.gate = null;
      }
      return flightDetails;
    }
  );
