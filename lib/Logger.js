/*!
 *  Logger.js - a module for Logger functionality.
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

const debug = require('debug');

const Helpers = {
  debug,
  debugExclusions: new RegExp(`(${[
    'Cannot find context',
    'context was destroyed',
    'failed to find element',
    'pool is draining',
    'Resource not currently part of this pool',
    'Session closed',
    'Target closed',
  ].join('|')})`, 'i'),
  isNegligibleValue (value) {
    return (value instanceof Error && value.message.match(Helpers.debugExclusions));
  },
};

/**
 * @alias module:puppeteer-extra-plugin-angular.Logger
 */
class Logger {
  constructor (namespace) {
    this.debugNamespace = debug(namespace);
  }

  destroy () {
    this.debugNamespace.destroy();
    this.debugNamespace = null;
  }

  /**
   * Process debug information if it is not negligible messages.
   *
   * @param {...*} args - Debug arguments.
   * @return {null} Null value.
   *
   * @example
   * const logger = new Logger('module:namespace');
   * const response = await logger.debug('debug message %s', Error('error'));
   */
  debug (...args) {
    if (!Helpers.isNegligibleValue([...args].pop())) {
      this.debugNamespace(...args);
    }
    return null;
  }

  /**
   * Process debug information if it is not negligible messagesi and return response value.
   *
   * @param {*} response - Response value.
   * @param {...*} args - Debug arguments.
   * @return {*} Given response value.
   *
   * @example
   * const logger = new Logger('module:namespace');
   * const response = await logger.debugAndReturn(true, 'debug message %s', Error('error'));
   */
  debugAndReturn (response, ...args) {
    this.debug(...args);
    return response;
  }
}

/* test-code */
/* istanbul ignore else */
if (global.jasmine) {
  Logger.__test__ = Helpers;
}
/* end-test-code */

module.exports = Logger;
