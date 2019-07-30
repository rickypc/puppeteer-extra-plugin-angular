/*!
 *  Click.test.js - tests for Click functionality.
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

const Click = require('../lib/Click.js');

const mock = {
  $: jest.fn(() => mock.element),
  $eval: jest.fn((selector, callback) => new Promise(async (resolve, reject) => {
    if (this.action === 'error') {
      reject(Error('error'));
    } else {
      resolve(callback(mock.element));
    }
  })),
  debug: jest.spyOn(Click.__test__.logger, 'debug'),
  element: {},
  waitUntilActionReady: jest.fn(() => new Promise(resolve => setTimeout(resolve, 100))),
};

describe('Click module test', () => {
  describe('ifExists', () => {
    beforeAll(() => {
      this.action = '';
      this.context = [];
      this.context.trigger = jest.fn(() => this.context);
      global.angular = {
        element: jest.fn(() => this.context),
      };
    });

    afterAll(() => {
      global.angular = null;
      this.context = null;
    });

    it('should return truthy', async () => {
      this.action = '';
      this.context.length = 1;
      mock.element = {};
      const actual = await Click.ifExists.call(mock, 'selector', 'label', 200);
      expect(actual).toBeTruthy();
      expect(mock.$).toHaveBeenCalledTimes(1);
      expect(mock.$).toHaveBeenNthCalledWith(1, 'selector');
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function));
      expect(mock.waitUntilActionReady).toHaveBeenCalledTimes(1);
      expect(mock.waitUntilActionReady).toHaveBeenNthCalledWith(1, 200);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s for %s', 'selector', 'label');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, mock.element);
      expect(this.context.trigger).toHaveBeenCalledTimes(1);
      expect(this.context.trigger).toHaveBeenNthCalledWith(1, 'click');
    });

    it('should use default value and return truthy', async () => {
      this.action = '';
      this.context.length = 1;
      mock.element = {};
      const actual = await Click.ifExists.call(mock, 'selector');
      expect(actual).toBeTruthy();
      expect(mock.$).toHaveBeenCalledTimes(1);
      expect(mock.$).toHaveBeenNthCalledWith(1, 'selector');
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function));
      expect(mock.waitUntilActionReady).toHaveBeenCalledTimes(1);
      expect(mock.waitUntilActionReady).toHaveBeenNthCalledWith(1, 25000);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s for %s', 'selector', 'click');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, mock.element);
      expect(this.context.trigger).toHaveBeenCalledTimes(1);
      expect(this.context.trigger).toHaveBeenNthCalledWith(1, 'click');
    });

    it('should return falsy', async () => {
      this.action = '';
      this.context.length = 0;
      mock.element = null;
      const actual = await Click.ifExists.call(mock, 'selector', 'label', 200);
      expect(actual).toBeFalsy();
      expect(mock.$).toHaveBeenCalledTimes(1);
      expect(mock.$).toHaveBeenNthCalledWith(1, 'selector');
      expect(mock.$eval).not.toHaveBeenCalled();
      expect(mock.waitUntilActionReady).not.toHaveBeenCalled();
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s for %s not found', 'selector', 'label');
      expect(angular.element).not.toHaveBeenCalled();
      expect(this.context.trigger).not.toHaveBeenCalled();
    });

    it('should log error', async () => {
      this.action = 'error';
      this.context.length = 1;
      mock.element = {};
      const actual = await Click.ifExists.call(mock, 'selector', 'label', 200);
      expect(actual).toBeFalsy();
      expect(mock.$).toHaveBeenCalledTimes(1);
      expect(mock.$).toHaveBeenNthCalledWith(1, 'selector');
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function));
      expect(mock.waitUntilActionReady).toHaveBeenCalledTimes(1);
      expect(mock.waitUntilActionReady).toHaveBeenNthCalledWith(1, 200);
      expect(mock.debug).toHaveBeenCalledTimes(2);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s for %s error: %s',
        'selector', 'label', expect.any(Error));
      expect(mock.debug).toHaveBeenNthCalledWith(2, '%s for %s not found', 'selector', 'label');
      expect(angular.element).not.toHaveBeenCalled();
      expect(this.context.trigger).not.toHaveBeenCalled();
    });
  });
});
