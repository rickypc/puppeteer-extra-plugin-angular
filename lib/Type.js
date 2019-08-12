/*!
 *  Type.js - a module for Type functionality with Angular synchronization.
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

const logger = new Logger('pepa:type');

/**
 * @alias module:puppeteer-extra-plugin-angular.Type
 */
const Type = {
  /**
   * Fill out the field on given selector with given value.
   *
   * @param {string} selector - Selector to match.
   * @param {string} value - Value to be used to fill out the field.
   * @param {string} [label='type'] - Debug label.
   * @return {Promise<boolean>} Truthy if the field is filled out, otherwise falsy.
   *
   * @example
   * const response = await page.typeIfExists('input.email', 'you@address.com', 'Email');
   */
  async ifExists (selector, value = '', label = 'type') {
    const response = await this.$eval(selector, (el, val) => {
      const result = {
        done: false,
        type: el.type,
      };
      const evtInit = { bubbles: true, cancelable: true };
      try {
        el.dispatchEvent(new Event('focus', evtInit));
        el.dispatchEvent(new Event('reset', evtInit));
        el.value = val;
        el.dispatchEvent(new Event('keydown', evtInit));
        el.dispatchEvent(new Event('keypress', evtInit));
        el.dispatchEvent(new Event('keyup', evtInit));
        el.dispatchEvent(new Event('input', evtInit));
        el.dispatchEvent(new Event('change', evtInit));
        el.dispatchEvent(new Event('blur', evtInit));
        result.done = true;
      } catch (ex) {
        // default value.
      }
      return result;
    }, value).catch((ex) => logger.debugAndReturn({ done: false },
      'el.type %s for %s error: %s', selector, label, ex));

    if (response.done) {
      const display = response.type === 'password' ? '*'.repeat(value.length) : value;
      logger.debug('%s on %s for %s', display, selector, label);
    } else {
      logger.debug('%s for %s not found', selector, label);
    }

    return response.done;
  },
};

/* test-code */
/* istanbul ignore else */
if (global.jasmine) {
  Type.__test__ = {
    logger,
  };
}
/* end-test-code */

module.exports = Type;
