const chai = require('chai');

const puppeteer = require('puppeteer');

const heathrow = require('../../../src/airports/heathrow');

const expect = chai.expect;

describe('Heathrow Airport', () => {
  it('finds flight details with gate', async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('file:///home/leon.cross/src/lc-playground/flightUpdater/heathrow.html');

    const expectedFlightDetails = {
      time: '11:10',
      to: 'Barcelona',
      code: 'AA6728',
      status: 'On time 11:10',
      terminal: '3',
      gate: null
    };

    // console.log(page);
    const returnedFlightDetails = await heathrow.scrape(page);

    await browser.close();

    expect(returnedFlightDetails).to.deep.equal(expectedFlightDetails);
  }).timeout(10000);
});
