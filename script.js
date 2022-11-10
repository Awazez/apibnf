const fs = require("fs");
const puppeteer = require("puppeteer");

async function captureScreenshot() {
  let browser = null;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("http://catalogue.bnf.fr/api/test.do");
    await page.type('.devsite-search-field', 'Headless Chrome');




    await page.screenshot({ path: `screenshots/github-profile.jpeg` });
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  } finally {
    await browser.close();
    console.log(`\n🎉 GitHub profile screenshots captured.`);
  }
}

captureScreenshot();