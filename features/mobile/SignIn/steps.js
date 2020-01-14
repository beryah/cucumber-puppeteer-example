const { After, Before, Given, When, Then } = require("cucumber");
const expect = require("expect");
const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");

const localize = require("./localize");

let browser;
let page;

Before(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  });
  page = await browser.newPage();

  // Refer to https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
  // for the list of devices
  await page.emulate(devices["iPhone X"]);

  await page.goto("https://sg.llesuorac.com/");
});

After(async () => {
  await browser.close();
});

Given(
  "I enter username {string} with password {string}",
  { timeout: 10000 },
  async (username, password) => {
    const meButton = "#root > div > div._1dy-mDMXCE > div > div:nth-child(3)";
    await page.waitForSelector(meButton, { visible: true });
    await page.click(meButton);

    const loginButton =
      "#ReactModalPortal-AUTH > div > div > div > div > div._3b6X7QQXKI > button";
    await page.waitForSelector(loginButton, { visible: true });
    await page.click(loginButton);

    const usernameInput =
      "#ReactModalPortal-LOGIN > div > div > div > div > form > div:nth-child(1) > div > div > input";
    await page.waitForSelector(usernameInput, { visible: true });
    await page.type(usernameInput, username);

    const passwordInput =
      "#ReactModalPortal-LOGIN > div > div > div > div > form > div:nth-child(2) > div > div > input";
    await page.waitForSelector(passwordInput, { visible: true });
    await page.type(passwordInput, password);
  }
);

When("I click login on login page", { timeout: 10000 }, async () => {
  const submitButton =
    "#ReactModalPortal-LOGIN > div > div > div > div > form > button";

  await page.waitForSelector(submitButton, { visible: true });
  await page.click(submitButton);
});

Then(
  "the user sees the error message {string}",
  { timeout: 20000 },
  async localizedKey => {
    const errorMessageSelector =
      "#ReactModalPortal-LOGIN > div > div > div > div > div._1GOvih8Qfo._1jNIEOv2tq > p";
    await page.waitForSelector(errorMessageSelector, { visible: true });
    const received = await (await page.$(errorMessageSelector)).evaluate(
      node => node.innerText
    );
    const expected = localize[localizedKey];
    expect(received).toBe(expected);
  }
);
