const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const expect = chai.expect;

const Flight = require('../../src/flightChecker');
const FileFinder = require('../../src/fileFinder');
const RequestHandler = require('../../src/requestHandler');

describe('FlightChecker', () => {
  const getwickCode = 'LGW';
  let flight;
  let fileFinderGetFileStub;
  let requestHandlerGetDataStub;

  describe('#getFlight', () => {
    // let mockFetchCall;
    // function setupMockServer(baseUrl, path) {
    //   mockFetchCall = nock(baseUrl)
    //     .get(path)
    //     .reply(200);
    // }

    beforeEach(() => {
      flight = new Flight();

      fileFinderGetFileStub = sinon.stub(FileFinder, 'getFile');

      fileFinderGetFileStub.returns({
        airport: 'airport',
        url: 'url',
        type: 'type'
      });

      requestHandlerGetDataStub = sinon.stub(RequestHandler, 'getData');
    });

    afterEach(() => {
      sinon.restore();
    });

    // it.only('makes a fetch request', async () => {
    //   const baseUrl = 'https://www.gatwickairport.com';
    //   const path = '/flights/departures-results/?flight=EZY837';
    //
    //   setupMockServer(baseUrl, path)
    //
    //   const expectedFlightObject = {
    //     time: '16:25',
    //     to: 'Belfast',
    //     code: 'EZY837',
    //     status: 'GATE OPEN',
    //     terminal: 'North',
    //     gate: '55E'
    //   };
    //
    //   fileFinderGetFileStub.returns({
    //     airport: { scrape: () => { return expectedFlightObject } },
    //     url: gatwickUrl,
    //     type: 'fetch'
    //   });
    //
    //   await flight.getFlight('EZY837', getwickCode, callbackSpy)
    //
    //   expect(mockFetchCall.isDone()).to.be.true
    // })

    // it.only('passes data onto the airport to handle the data scrape', async () => {
    //   const baseUrl = 'https://www.gatwickairport.com';
    //   const path = '/flights/departures-results/?flight=EZY837';
    //
    //   setupMockServer(baseUrl, path)
    //
    //   newcallbackSpy = sinon.spy()
    //
    //
    //   fileFinderGetFileStub.returns({
    //     airport: () => { return newcallbackSpy  },
    //     url: gatwickUrl,
    //     type: 'fetch'
    //   });
    //
    //   await flight.getFlight('EZY837', getwickCode, callbackSpy)
    //
    //   expect(newcallbackSpy).calledOnceWith('scrape')
    //
    // })

    it('returns object in the callback', async () => {
      const expectedFlightObject = {
        time: '16:25',
        to: 'Belfast',
        code: 'EZY837',
        status: 'GATE OPEN',
        terminal: 'North',
        gate: '55E'
      };

      requestHandlerGetDataStub.returns(expectedFlightObject);

      await flight.getFlight('EZY837', getwickCode, data => {
        expect(data).to.deep.equal(expectedFlightObject);
      });
    });

    it('returns null when no flight found', async () => {
      const code = 'noflightfound';

      requestHandlerGetDataStub.returns({ code: null });

      await flight.getFlight(code, getwickCode, data => {
        expect(data).to.equal(null);
      });
    });
  });
});
