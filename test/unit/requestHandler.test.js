const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const puppeteer = require('puppeteer');
const nock = require('nock');

const expect = chai.expect;
chai.use(sinonChai);

const gatwickAirport = require('../../src/airports/gatwick');

const RequestHandler = require('../../src/requestHandler');

describe('Request Handler', () => {
  let puppeteerCloseSpy;
  let puppeteerSetRequestInterceptionSpy;
  let puppeteerNewPageSpy;
  let puppeteerOnSpy;
  let puppeteerGoToSpy;
  let puppeteerLaunchStub;
  let airportScrapeStub;

  function setupMockServer(code) {
    const baseURL = 'https://www.gatwickairport.com';
    const path = '/flights/departures-results/?flight=';

    nock(baseURL)
      .get(path + code)
      .reply(200);
  }

  beforeEach(() => {
    puppeteerCloseSpy = sinon.spy();
    puppeteerSetRequestInterceptionSpy = sinon.spy();
    puppeteerNewPageSpy = sinon.spy();
    puppeteerOnSpy = sinon.spy();
    puppeteerGoToSpy = sinon.spy();

    puppeteerLaunchStub = sinon.stub(puppeteer, 'launch').resolves({
      close: () => puppeteerCloseSpy(),
      newPage: () => {
        puppeteerNewPageSpy();
        return {
          setRequestInterception: arg => puppeteerSetRequestInterceptionSpy(arg),
          on: arg => puppeteerOnSpy(arg),
          goto: (arg1, arg2) => puppeteerGoToSpy(arg1, arg2)
        };
      }
    });

    airportScrapeStub = sinon.stub(gatwickAirport, 'scrape');
  });

  afterEach(() => {
    sinon.restore();
  });

  context('#Puppeteer', () => {
    it('makes expected puppeteer calls', async () => {
      const type = 'puppeteer';
      const url = 'exampleUrl';
      const flightCode = 'exampleFlightCode';

      const expectedFlightDetails = {
        code: 'EZY837',
        gate: '55E',
        status: 'GATE OPEN',
        terminal: 'North',
        time: '16:25',
        to: 'Belfast'
      };

      airportScrapeStub.returns(expectedFlightDetails);

      await RequestHandler.getData(type, url, flightCode, gatwickAirport);

      expect(puppeteerLaunchStub).calledOnceWith({ headless: true });
      expect(puppeteerNewPageSpy).calledOnce;
      expect(puppeteerSetRequestInterceptionSpy).calledOnceWith(true);
      expect(puppeteerOnSpy).calledOnceWith('request');
      expect(puppeteerGoToSpy).calledOnceWith(url + flightCode, { waitUntil: 'networkidle2' });
      expect(puppeteerCloseSpy).calledOnce;
    });

    it('returns expected flight details', async () => {
      const type = 'puppeteer';
      const url = 'exampleUrl';
      const flightCode = 'exampleFlightCode';

      const expectedFlightDetails = {
        code: 'EZY837',
        gate: '55E',
        status: 'GATE OPEN',
        terminal: 'North',
        time: '16:25',
        to: 'Belfast'
      };

      airportScrapeStub.returns(expectedFlightDetails);

      const flightDetails = await RequestHandler.getData(type, url, flightCode, gatwickAirport);

      expect(flightDetails).to.equal(expectedFlightDetails);
    });
  });

  context('#Fetch', () => {
    it('makes expected fetch calls', async () => {
      const type = 'fetch';
      const url = 'https://www.gatwickairport.com/flights/departures-results/?flight=';
      const flightCode = 'EZY837';

      const expectedFlightDetails = {
        code: 'EZY837',
        gate: '55E',
        status: 'GATE OPEN',
        terminal: 'North',
        time: '16:25',
        to: 'Belfast'
      };

      airportScrapeStub.returns(expectedFlightDetails);
      setupMockServer(flightCode, expectedFlightDetails);

      const flightDetails = await RequestHandler.getData(type, url, flightCode, gatwickAirport);

      expect(flightDetails).to.equal(expectedFlightDetails);
    });
  });
});
