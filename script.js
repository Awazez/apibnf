const fs = require("fs");
const puppeteer = require("puppeteer");
const express = require("express")
var convert = require('xml-js');
const app = express()
const PORT = 4000


const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while(checkCounts++ <= maxChecks){
    let html = await page.content();
    let currentHTMLSize = html.length; 

    let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

    console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

    if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
      countStableSizeIterations++;
    else 
      countStableSizeIterations = 0; //reset the counter

    if(countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }  
};

app.get('/api/:id', function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.goto("http://catalogue.bnf.fr/api/test.do");
      await page.type('input[name=val1]', req.params.id);
      await page.click('input[value=Rechercher]');
      await waitTillHTMLRendered(page)
      const pages = await browser.pages()
      const bodyHTML = await pages[2].evaluate(() => document.body.innerText);
      res.send(bodyHTML);
      console.log(bodyHTML);
    } catch (e) {
      console.log(e);
    } finally {
      await browser.close();
    }
  })();
});

 app.listen(PORT, function(err){
     if (err) console.log("Error in server setup")
     console.log("Server listening on Port", PORT);
 })





