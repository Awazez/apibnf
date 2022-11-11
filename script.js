const fs = require("fs");
const puppeteer = require("puppeteer");
const props = "Olivier Norek"

async function captureScreenshot() {
  let browser = null;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("http://catalogue.bnf.fr/api/test.do");
    // Type into search box.
    await page.type('input[name=val1]', props);
    await page.click('input[value=Rechercher]');

    // Wait for suggest overlay to appear and click "show all results".

    await page.waitFor(2000);

    await page.screenshot({path: 'bnfscreenshot.png'});
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  } finally {
    await browser.close();
    console.log(`\n🎉 GitHub profile screenshots captured.`);
  }
}

captureScreenshot();


