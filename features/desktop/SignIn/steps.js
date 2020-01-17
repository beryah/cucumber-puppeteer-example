const { After, Before, Given, When, Then } = require("cucumber");
const expect = require("expect");
const puppeteer = require("puppeteer");

const localize = require("./localize");

Before({ timeout: 10000 }, async function() {
  await this.start();
});

After(async function() {
  await this.stop();
});

Given(
  "I enter username {string} with password {string}",
  { timeout: 10000 },
  async function(username, password) {
    const loginButton = await this.page.get(
      "#root > div > div.XhDULb5_Bm._2MEA7IfZIB > div._1XiJD-zRNp > div._2jAjs-CAxb > button._3dxOPpKVs8._2Hl0nzGgOH._3KEDnFP0dp._2gT_vTsr9I._1b4vm-B0Ln._1cRJDMLLub"
    );
    await loginButton.click();

    const usernameInput = await this.page.get(
      "#ReactModalPortal-LOGIN > div > div > div > div > form > div:nth-child(1) > div > div > input"
    );
    await usernameInput.type(username);

    const passwordInput = await this.page.get(
      "#ReactModalPortal-LOGIN > div > div > div > div > form > div.d8_oM-uW-y._34YLFy2b-t > div > div > input"
    );
    await passwordInput.type(password);
  }
);

When("I click login on login page", { timeout: 10000 }, async function() {
  const submitButton = await this.page.get(
    "#ReactModalPortal-LOGIN > div > div > div > div > form > button"
  );
  await submitButton.click();
});

Then(
  "the user sees the error message {string}",
  { timeout: 20000 },
  async function(localizedKey) {
    const errorMessage = await this.page.get(
      "#ReactModalPortal-LOGIN > div > div > div > div > form > p"
    );
    const received = await errorMessage.innerText();
    const expected = localize[localizedKey];
    expect(received).toBe(expected);
  }
);
