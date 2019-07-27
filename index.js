/*!
 *  index.js - Angular synchronization plugin.
 *  Copyright (c) 2018 - 2019 Richard Huang <rickypc@users.noreply.github.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin');
const Click = require('./lib/Click.js');
const Form = require('./lib/Form.js');
const Logger = require('./lib/Logger.js');
const Navigate = require('./lib/Navigate.js');
const Toggle = require('./lib/Toggle.js');
const Type = require('./lib/Type.js');
const Wait = require('./lib/Wait.js');

/**
 * Provide puppeteer functionality with Angular synchronization support.
 *
 * @extends external:PuppeteerExtraPlugin
 * @module puppeteer-extra-plugin-angular
 * @param {Object} opts - Options
 *
 * @example
 * const puppeteer = require('puppeteer-extra');
 * puppeteer.use(require('puppeteer-extra-plugin-angular')());
 *
 * (async () => {
 *   const configs = [
 *     {
 *       label: 'Email',
 *       selector: 'input.email',
 *       type: 'type',
 *       value: 'theEmail'
 *     },
 *     {
 *       label: 'Subscribe',
 *       selector: 'input.subscribe',
 *       type: 'check',
 *     },
 *     {
 *       label: 'Send',
 *       selector: 'button',
 *       type: 'click',
 *     },
 *   ];
 *   const data = {
 *     theEmail: 'you@address.com',
 *   };
 *
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *
 *   await page.navigateUntilReady('https://angular.io');
 *   await page.formFillOut(configs, data);
 *
 *   await page.clickIfExists('a.link', 'A Link');
 *
 *   await page.toggleUncheck('input.radio[value="1"]', 'Uncheck Radio');
 *   await page.toggleSelectByText('select1', 'Option 1', 'Selection');
 *   await page.toggleDeselectByText('select2', 'Option 2', 'Deselection');
 *   await page.toggleCheck('input.check', 'Checkbox');
 *   await page.waitUntilActionReady();
 *
 *   await page.typeIfExists('input.text', 'Something', 'Textfield');
 *   await page.waitUntilAngularReady();
 *
 *   await page.close();
 *   await browser.close();
 * })();
 */
class Plugin extends PuppeteerExtraPlugin {
  constructor (opts = {}) {
    super(opts);
    this.label = 'angular';
    this.logger = new Logger('pepa:index');
  }

  get name () {
    return this.label;
  }

  /**
   * @private
   */
  onPageCreated (page) {
    page.clickIfExists = Click.ifExists.bind(page);
    page.formFillOut = Form.fillOut.bind(page);
    page.navigateUntilReady = Navigate.untilReady.bind(page);
    page.toggleCheck = Toggle.check.bind(page);
    page.toggleDeselectByText = Toggle.deselectByText.bind(page);
    page.toggleSelectByText = Toggle.selectByText.bind(page);
    page.toggleUncheck = Toggle.uncheck.bind(page);
    page.typeIfExists = Type.ifExists.bind(page);
    page.waitUntilActionReady = Wait.untilActionReady.bind(page);
    page.waitUntilAngularReady = Wait.untilAngularReady.bind(page);
    this.logger.debug('onPageCreated');
  }
}

module.exports = pluginConfig => new Plugin(pluginConfig);
