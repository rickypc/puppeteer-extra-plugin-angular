/*!
 *  Form.js - a module for Form functionality with Angular synchronization.
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

const { search: jmespath } = require('jmespath');
const Click = require('./Click.js');
const Toggle = require('./Toggle.js');
const Type = require('./Type.js');

const Helpers = {
  fillOutField (page, config, data = {}) {
    return new Promise((resolve) => {
      let values = null;

      if (['deselect-text', 'select-text', 'type'].includes(config.type)) {
        values = Helpers.getValue(data, config.value, config.defaultValue);
      }

      switch (config.type) {
        case 'check':
          Toggle.check.call(page, config.selector, config.label)
            .then(resolve).catch(resolve);
          break;
        case 'click':
          Click.ifExists.call(page, config.selector, config.label, config.timeout)
            .then(resolve).catch(resolve);
          break;
        case 'deselect-text':
          Toggle.deselectByText.call(page, config.selector, values, config.label)
            .then(resolve).catch(resolve);
          break;
        case 'select-text':
          Toggle.selectByText.call(page, config.selector, values, config.label)
            .then(resolve).catch(resolve);
          break;
        case 'type':
          Type.ifExists.call(page, config.selector, values, config.label)
            .then(resolve).catch(resolve);
          break;
        case 'uncheck':
          Toggle.uncheck.call(page, config.selector, config.label)
            .then(resolve).catch(resolve);
          break;
        default:
          resolve();
      }
    });
  },
  getValue (data, pattern, defaultValue = null) {
    const result = jmespath(data, pattern);
    return typeof (result) !== 'undefined' && result !== null ? result : defaultValue;
  },
};

/**
 * @alias module:puppeteer-extra-plugin-angular.Form
 */
const Form = {
  /**
   * Fill out the form's field on given configs and data.
   *
   * @param {Object[]} configs - An array of field configs.
   * @param {string} [configs[].defaultValue=null] - Default value.
   * @param {string} configs[].label - Debug label.
   * @param {string} configs[].selector - Selector to match.
   * @param {check | click | deselect-text | select-text | type | uncheck}
   *   configs[].type - Action type.
   * @param {string} configs[].value - JmesPath expression of the given data.
   * @param {Object} [data={}] - Data to be used to fill out the form.
   * @return {Promise<void>} Promise to be resolved once the form filled out.
   *
   * @example
   * const configs = [
   *   {
   *     label: 'Name',
   *     selector: 'input.name',
   *     type: 'type',
   *     value: 'theName'
   *   },
   *   {
   *     label: 'Company',
   *     selector: 'input.company',
   *     type: 'type',
   *     value: 'theCompany'
   *   },
   * ];
   * const data = {
   *   theCompany: 'My Company',
   *   theName: 'My Name',
   * };
   * await page.formFillOut(configs, data);
   */
  fillOut (configs, data = {}) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(configs)) {
        configs.reduce((vow, config) => vow.then(() => Helpers
          .fillOutField(this, config, data)), Promise.resolve()).then(resolve);
      } else {
        reject(Error('Form config should be an array.'));
      }
    });
  },
};

/* test-code */
/* istanbul ignore else */
if (global.jasmine) {
  Form.__test__ = Helpers;
}
/* end-test-code */

module.exports = Form;
