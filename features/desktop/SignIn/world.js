const { setWorldConstructor } = require("cucumber");
const puppeteer = require("puppeteer");

class Page {
  constructor(page) {
    this.page = page;
  }

  async get(selector) {
    await this.page.waitForSelector(selector, { visible: true });
    return new Element(this.page, selector);
  }
}

class Element {
  constructor(page, selector) {
    this.page = page;
    this.selector = selector;
  }

  async click() {
    await this.page.click(this.selector);
  }

  async type(text) {
    await this.page.type(this.selector, text);
  }

  async innerText() {
    const handler = await this.page.$(this.selector);
    return await handler.evaluate(node => node.innerText);
  }
}

class World {
  async start() {
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      defaultViewport: { height: 800, width: 1200 }
    });

    const page = await this.browser.newPage();
    await page.goto("https://sg.llesuorac.com/");

    this.page = new Page(page);
  }

  async stop() {
    await this.browser.close();
  }
}

setWorldConstructor(World);
