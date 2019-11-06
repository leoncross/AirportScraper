const chai = require('chai');

const gatwickCompleteClone = require('../mockedFetchFiles/gatwickCompleteClone.json');
const gatwickNoGateClone = require('../mockedFetchFiles/gatwickNoGateClone.json');
const gatwickFlightNotFound = require('../mockedFetchFiles/gatwickFlightNotFound.json');

const gatwick = require('../../../src/airports/gatwick');

const expect = chai.expect;

describe('Gatwick Airport', () => {
  describe('#scrape', () => {
    // it('makes a fetch request', () => {
    //   const code = 'EZY837';
    //   setupMockServer(code, null);
    //
    //   gatwick.getFlightDetails(code);
    //
    //   expect(mockFetchCall.isDone()).to.be.true;
    // });

    it('finds flight details with gate', () => {
      // setupMockServer(code, gatwickCompleteClone);

      const expectedFlightDetails = {
        code: 'EZY837',
        gate: '55E',
        status: 'GATE OPEN',
        terminal: 'North',
        time: '16:25',
        to: 'Belfast'
      };

      const returnedFlightDetails = gatwick.scrape(gatwickCompleteClone);
      expect(returnedFlightDetails).to.deep.equal(expectedFlightDetails);
    });

    it('handles flight details with no gate', () => {
      // setupMockServer(code, gatwickNoGateClone);

      const expectedFlightDetails = {
        code: 'TP1337',
        gate: null,
        status: 'ENQUIRE AIRLINE',
        terminal: 'South',
        time: '16:20',
        to: 'Lisbon'
      };

      const returnedFlightDetails = gatwick.scrape(gatwickNoGateClone);
      expect(returnedFlightDetails).to.deep.equal(expectedFlightDetails);
    });

    it('handles no flight details found', () => {
      // setupMockServer(code, gatwickFlightNotFound);

      const expectedFlightDetails = {
        code: null,
        gate: null,
        status: null,
        terminal: null,
        time: null,
        to: null
      };

      const returnedFlightDetails = gatwick.scrape(gatwickFlightNotFound);
      expect(returnedFlightDetails).to.deep.equal(expectedFlightDetails);
    });
  });
});
