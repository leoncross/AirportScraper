const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const expect = chai.expect;

const Flight = require('../../src/flightChecker');
const FileFinder = require('../../src/fileFinder');

describe('FlightChecker', () => {
  const getwickCode = 'LGW';

  let flight;

  let fileFinderGetFileStub;

  describe('#getFlight', () => {
    beforeEach(() => {
      flight = new Flight();
      fileFinderGetFileStub = sinon.stub(FileFinder, 'getFile');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('returns object in the callback', done => {
      const code = 'EZY837';

      const expectedFlightObject = {
        time: '16:25',
        to: 'Belfast',
        code: 'EZY837',
        status: 'GATE OPEN',
        terminal: 'North',
        gate: '55E'
      };

      fileFinderGetFileStub.returns({
        getFlightDetails: () => expectedFlightObject
      });

      flight.getFlight(code, getwickCode, data => {
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

      fileFinderGetFileStub.returns({
        getFlightDetails: () => ({ code: null })
      });

      flight.getFlight(code, getwickCode, data => {
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
