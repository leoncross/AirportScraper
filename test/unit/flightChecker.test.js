const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nock = require('nock');

chai.use(sinonChai);

const expect = chai.expect;

const Flight = require('../../src/flightChecker');
const AirportFinder = require('../../src/airportFinder');
const FileFinder = require('../../src/fileFinder');

describe('FlightChecker', () => {
  const gatwickUrl = 'https://www.gatwickairport.com/flights/departures-results/?flight=';

  let flight;

  let mockFetchCall;
  let callbackSpy;
  let airportFinderGetUrlStub;
  let fileFinderGetFileStub;

  function setupMockServer(code) {
    const baseURL = 'https://www.gatwickairport.com';
    const path = '/flights/departures-results/?flight=';

    mockFetchCall = nock(baseURL)
      .get(path + code)
      .reply(200);
  }

  describe('#getFlight', () => {
    beforeEach(() => {
      flight = new Flight();
      callbackSpy = sinon.spy();
      airportFinderGetUrlStub = sinon.stub(AirportFinder, 'getUrl');
      fileFinderGetFileStub = sinon.stub(FileFinder, 'getFile');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('makes a fetch request', () => {
      const code = 'EZY837';
      setupMockServer(code);
      airportFinderGetUrlStub
        .withArgs(code)
        .returns({ airport: 'gatwick', url: gatwickUrl + code });

      flight.getFlight(code, callbackSpy);

      expect(mockFetchCall.isDone()).to.be.true;
    });
    it('returns object in the callback', done => {
      const code = 'EZY837';
      setupMockServer(code);

      airportFinderGetUrlStub
        .withArgs(sinon.match.any)
        .returns({ airport: 'gatwick', url: gatwickUrl + code });

      const expectedFlightObject = {
        time: '16:25',
        to: 'Belfast',
        code: 'EZY837',
        status: 'GATE OPEN',
        terminal: 'North',
        gate: '55E'
      };

      fileFinderGetFileStub.returns({
        scrape: () => expectedFlightObject
      });

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
      setupMockServer(code);
      airportFinderGetUrlStub
        .withArgs(sinon.match.any)
        .returns({ airport: 'gatwick', url: gatwickUrl + code });

      fileFinderGetFileStub.returns({
        scrape: () => ({ code: null })
      });

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
