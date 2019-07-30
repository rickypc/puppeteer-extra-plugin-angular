/*!
 *  Click.js - a module for Click functionality with Angular synchronization.
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

const Logger = require('./Logger.js');

const logger = new Logger('pepa:click');

/**
 * @alias module:puppeteer-extra-plugin-angular.Click
 */
const Click = {
  /**
   * Trigger Click event if given selector exists and wait for Angular to be ready.
   *
   * @param {string} selector - Selector to match.
   * @param {string} [label=click] - Debug label.
   * @param {number} [timeout=25000] - Maximum wait timeout.
   * @return {Promise<boolean>} Truthy if click triggered and Angular is ready, otherwise falsy.
   *
   * @example
   * const response = await page.clickIfExists('a[href="/"]', 'Some Link', 5000);
   */
  async ifExists (selector, label = 'click', timeout = 25000) {
    let response = await this.$(selector) !== null;

    if (response) {
      [, response] = await Promise.all([
        this.waitUntilActionReady(timeout),
        this.$eval(selector, el => !!angular.element(el).trigger('click').length),
      ]).catch(ex => logger.debugAndReturn([], '%s for %s error: %s', selector, label, ex));

      if (response) {
        logger.debug('%s for %s', selector, label);
      }
    }

    if (!response) {
      logger.debug('%s for %s not found', selector, label);
    }

    return response;
  },
};

/* test-code */
/* istanbul ignore else */
if (global.jasmine) {
  Click.__test__ = {
    logger,
  };
}
/* end-test-code */

module.exports = Click;
