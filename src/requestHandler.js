const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

const fetchData = async (url, flightCode, airport) =>
  new Promise(resolve => {
    fetch(url + flightCode)
      .then(data => data.text())
      .then(data => {
        // fs.writeFileSync('gatwickFlightNotFound.json', JSON.stringify(data))
        resolve(airport.scrape(data));
      });
  });

const puppeteerData = async (url, flightCode, airport) =>
  new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', req => {
        if (
          req.resourceType() === 'stylesheet' ||
          req.resourceType() === 'font' ||
          req.resourceType() === 'image'
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });
      await page.goto(url + flightCode, { waitUntil: 'networkidle2' });
      const flightDetails = await airport.scrape(page);
      await browser.close();
      return resolve(flightDetails);
    } catch (error) {
      return reject(error);
    }
  });

module.exports.getData = async (type, url, flightCode, airport) => {
  let flightDetails;

  if (type === 'fetch') {
    flightDetails = await fetchData(url, flightCode, airport);
  } else {
    flightDetails = await puppeteerData(url, flightCode, airport);
  }
  return flightDetails;
};
