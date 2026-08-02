const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  let errorCount = 0;
  let logCount = 0;
  page.on('console', msg => {
    logCount++;
    if (logCount <= 10) console.log('PAGE LOG:', msg.text());
    if (logCount === 10) console.log('... more logs suppressed');
  });
  page.on('pageerror', error => {
    errorCount++;
    console.log('PAGE ERROR STACK:', error.stack || error.message);
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  console.log(`Finished loading. Total logs: ${logCount}, Total errors: ${errorCount}`);
  await browser.close();
})();
