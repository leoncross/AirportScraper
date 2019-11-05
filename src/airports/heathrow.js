// const fs = require('fs');
const puppeteer = require('puppeteer');

const heathrow = 'https://www.heathrow.com/departures/flight-details/';

const scrape = page =>
  page.evaluate(() => {
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
  });

const pageSetup = async (url, page) => {
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (
      req.resourceType() === 'stylesheet' ||
      req.resourceType() === 'font' ||
      req.resourceType() === 'image'
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(url);
  await page.waitForSelector('#mainContent', {
    visible: true
  });
};

module.exports.getFlightDetails = async flightCode => {
  const url = heathrow + flightCode;

  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await pageSetup(url, page);
      const flightDetails = await scrape(page);
      await browser.close();
      return resolve(flightDetails);
    } catch (error) {
      return reject(error);
    }
  });
};
//
// getFlightDetails('AA6728').then((data) => {
//   console.log(data);
// })
