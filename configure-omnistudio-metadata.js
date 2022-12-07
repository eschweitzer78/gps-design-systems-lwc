#!/usr/bin/env node

const puppeteer = require("puppeteer");
const utils = require("./utils");

(async function () {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-features=site-per-process",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu"
    ]
  });

  console.log(process.argv);
  var targetUsername = process.argv[2]; //0 index

  var frontdoor = null;
  if (targetUsername) {
    frontdoor = await utils.runSFDXCommand(
      `sfdx force:org:open -u ${targetUsername} -r --json`
    );
  } else {
    frontdoor = await utils.runSFDXCommand(`sfdx force:org:open -r --json`);
  }

  console.log("target login url:", frontdoor.result.url);

  const regex = /.my.salesforce.com(.)*/;

  let urlData = frontdoor.result.url,
    scubbedUrl = urlData.replace("https://", ""),
    fqdn = scubbedUrl.replace(regex, "");

  const timeout = 30000;
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.goto(`${frontdoor.result.url}`, { waitUntil: "networkidle2" });

  console.log("logged in");

  // go to /lightning/setup/OmniStudioSettings/home
  let targetOSSettings = `https://${fqdn}.lightning.force.com/lightning/setup/OmniStudioSettings/home`;
  console.log("target settings url:", targetOSSettings);

  /*  await page.waitForNavigation({ timeout: timeout, waitUntil: "load" });
  console.log('did load');*/
  /*  await page.waitForNavigation({ timeout: timeout, waitUntil: "networkidle2" });
  console.log('did idle2');*/
  await page.goto(targetOSSettings, { waitUntil: "networkidle2" });
  console.log("navigated to setup");
  /*await Promise.all([
    page.waitForNavigation({ timeout: timeout, waitUntil: "load" }),
    page.waitForNavigation({ timeout: timeout, waitUntil: "networkidle2" }),
    page.goto(targetOSSettings)
  ]);
  */

  await page.setViewport({ width: 1200, height: 837 });
  await utils.sleep(10000);

  //OmniStudio Metadata

  try {
    await page.evaluateHandle(() =>
      document
        .querySelectorAll("runtime_omnistudio-pref-toggle")[0]
        .shadowRoot.querySelector("lightning-input")
        .shadowRoot.querySelector("input")
        .click()
    );
  } catch (error) {
    console.log(error);
  }

  await utils.sleep(10000);
  await browser.close();
})();
