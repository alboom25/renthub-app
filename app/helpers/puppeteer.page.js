const puppeteer = require("puppeteer");

let page;

module.exports.getPage = async () => {
    if (page) return page;

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
        ignoreDefaultArgs: ['--disable-extensions'],
    });

    page = await browser.newPage();

    return page;
};