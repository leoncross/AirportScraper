const chai = require('chai');
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');

const gatwickCompleteClone = require('../mockedFetchFiles/gatwickCompleteClone.json');
const gatwickNoGateClone = require('../mockedFetchFiles/gatwickNoGateClone.json');
const gatwickFlightNotFound = require('../mockedFetchFiles/gatwickFlightNotFound.json');

const gatwick = require('../../../src/airports/gatwick');
// chai.use(sinonChai);

const expect = chai.expect;

describe('Gatwick Airport', () => {
  describe('#scrape', () => {
    it('finds flight details with gate', () => {
      const flightDetails = {
        code: 'EZY837',
        gate: '55E',
        status: 'GATE OPEN',
        terminal: 'North',
        time: '16:25',
        to: 'Belfast'
      };

      expect(gatwick.scrape(gatwickCompleteClone)).to.deep.equal(flightDetails);
    });
    it('handles flight details with no gate', () => {
      const flightDetails = {
        code: 'TP1337',
        gate: null,
        status: 'ENQUIRE AIRLINE',
        terminal: 'South',
        time: '16:20',
        to: 'Lisbon'
      };

      expect(gatwick.scrape(gatwickNoGateClone)).to.deep.equal(flightDetails);
    });
    it('handles no flight details found', () => {
      const flightDetails = {
        code: null,
        gate: null,
        status: null,
        terminal: null,
        time: null,
        to: null
      };

      expect(gatwick.scrape(gatwickFlightNotFound)).to.deep.equal(flightDetails);
    });
  });
});
