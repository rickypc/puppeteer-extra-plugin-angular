/*!
 *  Navigate.js - a module for Navigate functionality with Angular synchronization.
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

const logger = new Logger('pepa:navigate');

/**
 * @alias module:puppeteer-extra-plugin-angular.Navigate
 */
const Navigate = {
  /**
   * Navigate to given url and wait for Angular to be ready.
   *
   * @param {string} url - Target URL.
   * @param {number} [timeout=25000] - Maximum wait timeout.
   * @return {Promise<void>} Promise to be resolved once the navigation is completed.
   *
   * @example
   * await page.navigateUntilReady('https://angular.io', 5000);
   */
  async untilReady (url, timeout = 25000) {
    await this.goto(url, { timeout: 0 }).catch(ex => logger.debug('%s error: %s', url, ex));
    await this.waitUntilActionReady(timeout);
    logger.debug('to %s', url);
  },
};

/* test-code */
/* istanbul ignore else */
if (global.jasmine) {
  Navigate.__test__ = {
    logger,
  };
}
/* end-test-code */

module.exports = Navigate;
