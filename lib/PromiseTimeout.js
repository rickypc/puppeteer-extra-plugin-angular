/*!
 *  PromiseTimeout.js - a module for Promise with timeout functionality.
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

/**
 * @alias module:puppeteer-extra-plugin-angular.PromiseTimeout
 */
const PromiseTimeout = {
  /**
   * Executor function that is executed immediately by the Promise implementation.
   *
   * @callback module:puppeteer-extra-plugin-angular.PromiseTimeout~Executor
   * @param {Function} resolve - Resolve the promise.
   * @param {Function} reject - Reject the promise.
   * @param {Function} pending - True if Promise is not timed out, otherwise false.
   *
   * @example
   * const executor = (resolve, reject, pending) => {
   *   // Do something promising here...
   *   if (pending()) {
   *     try {
   *       // Do something more promising here...
   *       resolve(true);
   *     } catch (ex) {
   *       reject(false);
   *     }
   *   }
   * };
   */

  /**
   * Timeout executor function that is executed when max wait timeout is reached.
   *
   * @callback module:puppeteer-extra-plugin-angular.PromiseTimeout~TimeoutExecutor
   * @param {Function} resolve - Resolve the promise.
   * @param {Function} reject - Reject the promise.
   *
   * @example
   * const timeoutExecutor = (resolve, reject) => {
   *   try {
   *     resolve(true);
   *   } catch (ex) {
   *     reject(false);
   *   }
   * };
   */

  /**
   * Provide timeout procedure on inflight promise.
   *
   * @param {Executor} executor - Executor function.
   * @param {TimeoutExecutor} timeoutExecutor - Timeout executor function.
   * @param {number} timeout - Maximum wait timeout.
   * @return {Promise<*>} Resolve or reject response value.
   *
   * @example
   * const response = await PromiseTimeout.untilSettledOrTimedOut((resolve, reject, pending) => {
   *   // Do something promising here...
   *   if (pending()) {
   *     // Do something more promising here...
   *     resolve(true);
   *   }
   * }, (resolve, reject) => {
   *   reject(Error('error'));
   * }, 5000);
   */
  untilSettledOrTimedOut (executor, timeoutExecutor, timeout) {
    let pending = true;
    let timedout = false;
    let timer = null;

    return new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        pending = false;
        timedout = true;
        timeoutExecutor(resolve, reject);
      }, timeout);
      executor(resolve, reject, () => pending);
    }).finally(() => {
      if (!timedout) {
        clearTimeout(timer);
      }
    });
  },
};

module.exports = PromiseTimeout;
