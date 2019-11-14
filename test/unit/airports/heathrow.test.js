const chai = require('chai');
const puppeteer = require('puppeteer');

const expect = chai.expect;

const heathrow = require('../../../src/airports/heathrow');

describe('Heathrow Airport', () => {
  it('finds flight details with gate', async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const heathrowNoGate = `file://${process.cwd()}/test/unit/mockedPuppeteerFiles/heathrowNoGate.html`;

    await page.goto(heathrowNoGate);

    const expectedFlightDetails = {
      time: '11:10',
      to: 'Barcelona',
      code: 'AA6728',
      status: 'On time 11:10',
      terminal: '3',
      gate: null
    };

    const returnedFlightDetails = await heathrow.scrape(page);

    await browser.close();

    expect(returnedFlightDetails).to.deep.equal(expectedFlightDetails);
  }).timeout(10000);
});
