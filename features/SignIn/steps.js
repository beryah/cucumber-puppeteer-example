const { After, Before, Given, When, Then } = require("cucumber");
const expect = require("expect");
const puppeteer = require("puppeteer");

let browser;
let page;

Before(async () => {
  browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 200,
    defaultViewport: { height: 800, width: 1200 }
  });
  page = await browser.newPage();
  await page.goto("https://sg.llesuorac.com/");
});

After(async () => {
  await browser.close();
});

Given(
  "I enter username {string} with password {string}",
  { timeout: 10000 },
  async (username, password) => {
    const loginButton =
      "#root > div > div.XhDULb5_Bm._2MEA7IfZIB > div._1XiJD-zRNp > div._2jAjs-CAxb > button._3dxOPpKVs8._2Hl0nzGgOH._3KEDnFP0dp._2gT_vTsr9I._1b4vm-B0Ln._1cRJDMLLub";
    await page.waitForSelector(loginButton, { visible: true });
    await page.click(loginButton);

    const usernameInput =
      "#ReactModalPortal-LOGIN > div > div > div > div > form > div:nth-child(1) > div > div > input";
    await page.waitForSelector(usernameInput, { visible: true });
    await page.type(usernameInput, username);

    const passwordInput =
      "#ReactModalPortal-LOGIN > div > div > div > div > form > div.d8_oM-uW-y._34YLFy2b-t > div > div > input";
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
  async expected => {
    const errorMessageSelector =
      "#ReactModalPortal-LOGIN > div > div > div > div > form > p";
    await page.waitForSelector(errorMessageSelector, { visible: true });
    const received = await (await page.$(errorMessageSelector)).evaluate(
      node => node.innerText
    );
    expect(received).toBe(expected);
  }
);
