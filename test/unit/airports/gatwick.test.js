const chai = require('chai');
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
const nock = require('nock');

const gatwickCompleteClone = require('../mockedFetchFiles/gatwickCompleteClone.json');
const gatwickNoGateClone = require('../mockedFetchFiles/gatwickNoGateClone.json');
const gatwickFlightNotFound = require('../mockedFetchFiles/gatwickFlightNotFound.json');

const gatwick = require('../../../src/airports/gatwick');
// chai.use(sinonChai);

const expect = chai.expect;

describe('Gatwick Airport', () => {
  let mockFetchCall;

  function setupMockServer(code, returnedValue) {
    const baseURL = 'https://www.gatwickairport.com';
    const path = '/flights/departures-results/?flight=';

    mockFetchCall = nock(baseURL)
      .get(path + code)
      .reply(200, returnedValue);
  }

  describe('#scrape', () => {
    it('makes a fetch request', () => {
      const code = 'EZY837';
      setupMockServer(code, null);

      gatwick.getFlightDetails(code);

      expect(mockFetchCall.isDone()).to.be.true;
    });

    it('finds flight details with gate', async () => {
      const code = 'EZY837';
      setupMockServer(code, gatwickCompleteClone);

      const expectedFlightDetails = {
        code: 'EZY837',
        gate: '55E',
        status: 'GATE OPEN',
        terminal: 'North',
        time: '16:25',
        to: 'Belfast'
      };

      const returnedFlightDetails = await gatwick.getFlightDetails(code);
      expect(returnedFlightDetails).to.deep.equal(expectedFlightDetails);
    });

    it('handles flight details with no gate', async () => {
      const code = 'TP1337';
      setupMockServer(code, gatwickNoGateClone);

      const expectedFlightDetails = {
        code: 'TP1337',
        gate: null,
        status: 'ENQUIRE AIRLINE',
        terminal: 'South',
        time: '16:20',
        to: 'Lisbon'
      };

      const returnedFlightDetails = await gatwick.getFlightDetails(code);
      expect(returnedFlightDetails).to.deep.equal(expectedFlightDetails);
    });

    it('handles no flight details found', async () => {
      const code = 'flightNotFound';
      setupMockServer(code, gatwickFlightNotFound);

      const expectedFlightDetails = {
        code: null,
        gate: null,
        status: null,
        terminal: null,
        time: null,
        to: null
      };

      const returnedFlightDetails = await gatwick.getFlightDetails(code);
      expect(returnedFlightDetails).to.deep.equal(expectedFlightDetails);
    });
  });
});
