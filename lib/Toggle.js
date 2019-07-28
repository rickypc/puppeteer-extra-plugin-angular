/*!
 *  Toggle.js - a module for Toggle functionality with Angular synchronization.
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

const logger = new Logger('pepa:toggle');

const Helpers = {
  logger,
  async toggleCheckbox (page, selector, label = 'toggle', checked = false) {
    const response = await page.$eval(selector, (el, checkValue) => !!angular
      .element(el)
      .prop('checked', checkValue)
      .trigger('change')
      .trigger('focusout')
      .length, checked)
      .catch(ex => logger.debug('toggle.checkbox %s for %s error: %s', selector, label, ex));

    if (response) {
      logger.debug('%s is %schecked for %s', selector, (!checked ? 'un' : ''), label);
    } else {
      logger.debug('%s for %s not found', selector, label);
    }

    return response;
  },
  async toggleSelectByText (page, selector, inputValues = [], label = 'toggle', selected = false) {
    let values = inputValues;

    if (!Array.isArray(values)) {
      values = [values];
    }

    const response = await page.$eval(selector, (el, valueList, selectValue) => {
      const options = Array.from((el || {}).options || []);
      const selectedOptions = options.filter(option => valueList.includes(option.text));

      for (let i = 0, j = selectedOptions.length; i < j; i += 1) {
        selectedOptions[i].selected = selectValue;
      }

      return !!angular.element(el).trigger('change').trigger('focusout').length;
    }, values, selected)
      .catch(ex => logger.debug('toggle.select %s for %s error: %s', selector, label, ex));

    if (response) {
      logger.debug('%s to %sselected on %s for %s', values.join(', '),
        (!selected ? 'de' : ''), selector, label);
    } else {
      logger.debug('%s for %s not found', selector, label);
    }

    return response;
  },
};

/**
 * @alias module:puppeteer-extra-plugin-angular.Toggle
 */
const Toggle = {
  /**
   * Check the checkbox or radio button field.
   *
   * @param {string} selector - Selector to match.
   * @param {string} [label=toggle] - Debug label.
   * @return {Promise<boolean>} Truthy if the field is checked, otherwise falsy.
   *
   * @example
   * const response = await page.toggleCheck('input.checkbox', 'Some Checkbox');
   */
  async check (selector, label = 'toggle') {
    return Helpers.toggleCheckbox(this, selector, label, true);
  },
  /**
   * Deselect given values from the select field options.
   *
   * @param {string} selector - Selector to match.
   * @param {Array} values - A list of value to be deselected from the select field.
   * @param {string} [label=toggle] - Debug label.
   * @return {Promise<boolean>} Truthy if the given values are deselected, otherwise falsy.
   *
   * @example
   * const response = await page.toggleDeselectByText('select.by-text',
   *   'Some Option', 'Some Select');
   */
  async deselectByText (selector, values, label = 'toggle') {
    return Helpers.toggleSelectByText(this, selector, values, label, false);
  },
  /**
   * Select given values from the select field options.
   *
   * @param {string} selector - Selector to match.
   * @param {Array} values - A list of value to be selected from the select field.
   * @param {string} [label=toggle] - Debug label.
   * @return {Promise<boolean>} Truthy if the given values are selected, otherwise falsy.
   *
   * @example
   * const response = await page.toggleSelectByText('select.by-text',
   *   'Some Other Option', 'Some Select');
   */
  async selectByText (selector, values, label = 'toggle') {
    return Helpers.toggleSelectByText(this, selector, values, label, true);
  },
  /**
   * Uncheck the checkbox or radio button field.
   *
   * @param {string} selector - Selector to match.
   * @param {string} [label=toggle] - Debug label.
   * @return {Promise<boolean>} Truthy if the field is unchecked, otherwise falsy.
   *
   * @example
   * const response = await page.toggleUncheck('input.checkbox', 'Some Checkbox');
   */
  async uncheck (selector, label = 'toggle') {
    return Helpers.toggleCheckbox(this, selector, label, false);
  },
};

/* test-code */
/* istanbul ignore else */
if (global.jasmine) {
  Toggle.__test__ = Helpers;
}
/* end-test-code */

module.exports = Toggle;
