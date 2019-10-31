const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nock = require('nock');

const website = require('./fetchFiles/website.json')

chai.use(sinonChai);

const expect = chai.expect;

const Flight = require('../../src/flightChecker');

describe('flightChecker', () => {
  let flight;
  let mockFetchCall

  function setupMockServer (code) {
    const baseURL = 'https://www.gatwickairport.com';
    const path = '/flights/departures-results/?flight=';

    return mockFetchCall = nock(baseURL)
      .get(path + code)
      .reply(200, website);

  }

  beforeEach(() => {
    flight = new Flight();
    callbackSpy = sinon.spy()
  });

  describe('#getFlight', () => {
    it('makes a request to the gatwick website', () => {
      const code = 'EZY837';
      setupMockServer(code)

      flight.getFlight(code, callbackSpy)

      expect(mockFetchCall.isDone()).to.be.true;

    });
    it('calls to Gatwick and returns an object within the callback', (done) => {
      const code = 'EZY837';
      setupMockServer(code)

      const expected = {
        time: '16:25',
        to: 'Belfast',
        code: 'EZY837',
        status: 'GATE OPEN',
        terminal: 'North',
        gate: '55E'
      }

      flight.getFlight(code, (data) => {
        try {
          expect(data).to.deep.equal(expected)
          done()
        } catch (err) {
          done(err)
        }
      });
    })
  });
});
