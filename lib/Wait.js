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

const { untilSettledOrTimedOut } = require('timeable-promise');
const Logger = require('./Logger.js');

const logger = new Logger('pepa:wait');

const Helpers = {
  logger,
  untilAngularReady (page, timeout = 25000) {
    return page.evaluate(delay => new Promise((resolve) => {
      let readied = false;
      let timedout = false;
      const timer = setTimeout(() => {
        timedout = true;
        resolve(readied);
      }, delay);
      const done = () => {
        readied = true;
        if (!timedout) {
          timedout = true;
          clearTimeout(timer);
        }
        resolve(readied);
      };

      if (angular) {
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
        $inj.get('$browser').notifyWhenNoOutstandingRequests(done);
      } else {
        done();
      }
    }), timeout).catch(ex => logger.debugAndReturn(false, 'untilAngularReady error: %s', ex));
  },
  untilPageReady (page, timeout = 10000) {
    return page.waitFor(() => ['interactive', 'complete']
      .includes(document.readyState), { timeout })
      .catch((ex) => {
        /* istanbul ignore else */
        if (ex.constructor.name !== 'TimeoutError') {
          logger.debug('untilPageReady error: %s', ex);
        }
        return false;
      });
  },
  untilSettledOrTimedOut,
  untilTargetReady (page, timeout = 25000) {
    const browser = page.browser();
    let listener = null;
    let response = false;
    const targetId = page.target()._targetId;

    return Helpers.untilSettledOrTimedOut((resolve, reject, pending) => {
      listener = (target) => {
        /* istanbul ignore else */
        if (pending() && target._targetId === targetId) {
          response = true;
          browser.removeListener('targetcreated', listener);
          browser.removeListener('targetchanged', listener);
          resolve(response);
        }
      };

      browser.on('targetcreated', listener);
      browser.on('targetchanged', listener);
    }, (resolve) => {
      browser.removeListener('targetcreated', listener);
      browser.removeListener('targetchanged', listener);
      resolve(response);
    }, timeout);
  },
};

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
    await Helpers.untilTargetReady(this, Math.ceil(timeout / 5));
    logger.debug('target is ready');
    await Helpers.untilPageReady(this, Math.ceil(timeout / 2.5));
    logger.debug('page is ready');
    await Helpers.untilAngularReady(this, timeout);
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
    await Helpers.untilAngularReady(this, timeout);
    logger.debug('angular is ready');
  },
};

/* test-code */
/* istanbul ignore else */
if (global.jasmine) {
  Wait.__test__ = Helpers;
}
/* end-test-code */

module.exports = Wait;
