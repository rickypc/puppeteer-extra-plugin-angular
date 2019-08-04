const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-angular')());

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to given Url and wait until Angular is ready.
  await page.navigateUntilReady('https://angular.io');

  // Selector will find a button on the top of the page that say "Get Started".
  await page.clickIfExists('a.button.hero-cta', 'Top Get Started Button');
  // Should navigate to the new Url.
  console.log(page.target().url()); // https://angular.io/start

  // Selector won't find any element on this page.
  await page.clickIfExists('a.button.hero-cta', 'Top Get Started Button');
  // Url should be the same
  console.log(page.target().url()); // https://angular.io/start

  await page.close();
  await browser.close();
})();
