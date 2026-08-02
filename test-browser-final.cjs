const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  let errorCount = 0;
  let logCount = 0;
  page.on('console', msg => {
    if (msg.type() === 'error') {
       console.log('PAGE CONSOLE ERROR:', msg.text());
       errorCount++;
    }
  });
  page.on('pageerror', error => {
    errorCount++;
    console.log('PAGE ERROR STACK:', error.stack || error.message);
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('Timeout', e.message));
  console.log(`Finished loading. Total errors: ${errorCount}`);
  await browser.close();
})();
