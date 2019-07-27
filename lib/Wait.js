/*!
 *  Wait.js - a module for Wait functionality with Angular synchronization.
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

const logger = new Logger('pepa:wait');

const untilAngularReady = async (page, timeout = 25000) => Promise.race([
  page.evaluate(() => new Promise((resolve) => {
    if (window.angular) {
      let $inj;
      try {
        $inj = angular.element(document
          .querySelector('[data-ng-app],[ng-app],.ng-scope') || document)
          .injector();
      } catch (ex) {
        // default injector.
      }
      $inj = $inj || angular.injector(['ng']);
      $inj.get = $inj.get || $inj;
      $inj.get('$browser').notifyWhenNoOutstandingRequests(resolve);
    } else {
      resolve();
    }
  })).catch(ex => logger.debug('untilAngularReady error: %s', ex)),
  page.waitFor(timeout).catch(ex => logger.debug('untilAngularReady error: %s', ex)),
]);

const untilPageReady = (page, timeout = 10000) => Promise.race([
  page.waitFor(() => ['interactive', 'complete'].includes(document.readyState)),
  page.waitFor(timeout).catch(ex => logger.debug('untilPageReady error: %s', ex)),
]);

/**
 * @alias module:puppeteer-extra-plugin-angular.Wait
 */
const Wait = {
  /**
   * Wait until both page and Angular is ready.
   *
   * @param {number} [timeout=25000] - Maximum wait timeout.
   * @return {Promise<void>} Promise to be resolved once the wait is completed.
   *
   * @example
   * await page.waitUntilActionReady(5000);
   */
  async untilActionReady (timeout = 25000) {
    await untilPageReady(this, Math.ceil(timeout / 2.5));
    logger.debug('page is ready');
    await untilAngularReady(this, timeout);
    logger.debug('angular is ready');
  },
  /**
   * Wait until Angular is ready.
   *
   * @param {number} [timeout=25000] - Maximum wait timeout.
   * @return {Promise<void>} Promise to be resolved once the wait is completed.
   *
   * @example
   * await page.waitUntilAngularReady(5000);
   */
  async untilAngularReady (timeout = 25000) {
    await untilAngularReady(this, timeout);
    logger.debug('angular is ready');
  },
};

/* test-code */
/* istanbul ignore else */
if (global.jasmine) {
  Wait.__test__ = {
    logger,
  };
}
/* end-test-code */

module.exports = Wait;
