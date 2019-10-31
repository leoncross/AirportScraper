const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nock = require('nock');

const gatwickCompleteClone = require('./mockedFetchFiles/gatwickCompleteClone.json');
const gatwickNoGateClone = require('./mockedFetchFiles/gatwickNoGateClone.json');
const gatwickFlightNotFound = require('./mockedFetchFiles/gatwickFlightNotFound.json');

chai.use(sinonChai);

const expect = chai.expect;

const Flight = require('../../src/flightChecker');

describe('flightChecker', () => {
  let flight;

  let mockFetchCall;
  let callbackSpy;

  function setupMockServer(code, website) {
    const baseURL = 'https://www.gatwickairport.com';
    const path = '/flights/departures-results/?flight=';

    mockFetchCall = nock(baseURL)
      .get(path + code)
      .reply(200, website);

    return mockFetchCall;
  }

  describe('#getFlight', () => {
    beforeEach(() => {
      flight = new Flight();
      callbackSpy = sinon.spy();
    });

    it('makes a fetch request', () => {
      const code = 'EZY837';
      setupMockServer(code, gatwickCompleteClone);

      flight.getFlight(code, callbackSpy);

      expect(mockFetchCall.isDone()).to.be.true;
    });
    it('returns object in the callback', done => {
      const code = 'EZY837';
      setupMockServer(code, gatwickCompleteClone);

      const expectedFlightObject = {
        time: '16:25',
        to: 'Belfast',
        code: 'EZY837',
        status: 'GATE OPEN',
        terminal: 'North',
        gate: '55E'
      };

      flight.getFlight(code, data => {
        try {
          expect(data).to.deep.equal(expectedFlightObject);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    it('handles results when no gate available', done => {
      const code = 'TP1337';
      setupMockServer(code, gatwickNoGateClone);

      const expectedFlightObject = {
        time: '16:20',
        to: 'Lisbon',
        code: 'TP1337',
        status: 'ENQUIRE AIRLINE',
        terminal: 'South',
        gate: null
      };

      flight.getFlight(code, data => {
        try {
          expect(data).to.deep.equal(expectedFlightObject);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    it('returns null when no flight found', done => {
      const code = 'noflightfound';
      setupMockServer(code, gatwickFlightNotFound);

      flight.getFlight(code, data => {
        try {
          expect(data).to.equal(null);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
