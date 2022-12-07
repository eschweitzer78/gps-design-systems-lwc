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

  console.log(frontdoor.result.url);

  let urlData = frontdoor.result.url,
    scubbedUrl = urlData.replace("https://", ""),
    parsedUrl = scubbedUrl.split("/"),
    fqdn = parsedUrl[0],
    parsedFqdn = fqdn.split(".");

  const timeout = 30000;
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.goto(`${frontdoor.result.url}`);

  //await page.waitFor(10000);
  //go to /lightning/setup/OmniStudioSettings/home
  let targetOSSettings = `https://${parsedFqdn[0]}.lightning.force.com/lightning/setup/OmniStudioSettings/home`;
  console.log(targetOSSettings);

  await Promise.all([
    page.waitForNavigation({ timeout: timeout, waitUntil: "load" }),
    page.waitForNavigation({ timeout: timeout, waitUntil: "networkidle2" }),
    page.goto(targetOSSettings)
  ]);

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
