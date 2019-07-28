/*!
 *  Toggle.test.js - tests for Toggle functionality.
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

const Toggle = require('../lib/Toggle.js');

const mock = {
  $eval: jest.fn((selector, callback, ...args) => new Promise(async (resolve, reject) => {
    if (this.action === 'error') {
      reject(Error('error'));
    } else {
      resolve(callback(mock.element, ...args));
    }
  })),
  debug: jest.spyOn(Toggle.__test__.logger, 'debug'),
  element: {},
};

describe('Toggle module test', () => {
  describe('check', () => {
    beforeAll(() => {
      this.toggleCheckbox = jest.spyOn(Toggle.__test__, 'toggleCheckbox')
        .mockImplementation(() => {});
    });

    afterAll(() => {
      this.toggleCheckbox.mockRestore();
      this.toggleCheckbox = null;
    });

    it('should return resolved', async () => {
      await Toggle.check('selector', 'label');
      expect(this.toggleCheckbox).toHaveBeenCalledTimes(1);
      expect(this.toggleCheckbox).toHaveBeenNthCalledWith(1, Toggle, 'selector', 'label', true);
    });

    it('should use default value and return resolved', async () => {
      await Toggle.check('selector');
      expect(this.toggleCheckbox).toHaveBeenCalledTimes(1);
      expect(this.toggleCheckbox).toHaveBeenNthCalledWith(1, Toggle, 'selector', 'toggle', true);
    });
  });

  describe('deselectByText', () => {
    beforeAll(() => {
      this.toggleSelectByText = jest.spyOn(Toggle.__test__, 'toggleSelectByText')
        .mockImplementation(() => {});
    });

    afterAll(() => {
      this.toggleSelectByText.mockRestore();
      this.toggleSelectByText = null;
    });

    it('should return resolved', async () => {
      await Toggle.deselectByText('selector', 'value', 'label');
      expect(this.toggleSelectByText).toHaveBeenCalledTimes(1);
      expect(this.toggleSelectByText).toHaveBeenNthCalledWith(1, Toggle,
        'selector', 'value', 'label', false);
    });

    it('should use default value and return resolved', async () => {
      await Toggle.deselectByText('selector', 'value');
      expect(this.toggleSelectByText).toHaveBeenCalledTimes(1);
      expect(this.toggleSelectByText).toHaveBeenNthCalledWith(1, Toggle,
        'selector', 'value', 'toggle', false);
    });
  });

  describe('selectByText', () => {
    beforeAll(() => {
      this.toggleSelectByText = jest.spyOn(Toggle.__test__, 'toggleSelectByText')
        .mockImplementation(() => {});
    });

    afterAll(() => {
      this.toggleSelectByText.mockRestore();
      this.toggleSelectByText = null;
    });

    it('should return resolved', async () => {
      await Toggle.selectByText('selector', 'value', 'label');
      expect(this.toggleSelectByText).toHaveBeenCalledTimes(1);
      expect(this.toggleSelectByText).toHaveBeenNthCalledWith(1, Toggle,
        'selector', 'value', 'label', true);
    });

    it('should use default value and return resolved', async () => {
      await Toggle.selectByText('selector', 'value');
      expect(this.toggleSelectByText).toHaveBeenCalledTimes(1);
      expect(this.toggleSelectByText).toHaveBeenNthCalledWith(1, Toggle,
        'selector', 'value', 'toggle', true);
    });
  });

  describe('uncheck', () => {
    beforeAll(() => {
      this.toggleCheckbox = jest.spyOn(Toggle.__test__, 'toggleCheckbox')
        .mockImplementation(() => {});
    });

    afterAll(() => {
      this.toggleCheckbox.mockRestore();
      this.toggleCheckbox = null;
    });

    it('should return resolved', async () => {
      await Toggle.uncheck('selector', 'label');
      expect(this.toggleCheckbox).toHaveBeenCalledTimes(1);
      expect(this.toggleCheckbox).toHaveBeenNthCalledWith(1, Toggle, 'selector', 'label', false);
    });

    it('should use default value and return resolved', async () => {
      await Toggle.uncheck('selector');
      expect(this.toggleCheckbox).toHaveBeenCalledTimes(1);
      expect(this.toggleCheckbox).toHaveBeenNthCalledWith(1, Toggle, 'selector', 'toggle', false);
    });
  });

  describe('toggleCheckbox', () => {
    beforeAll(() => {
      this.action = '';
      this.context = [];
      this.context.prop = jest.fn(() => this.context);
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
      const actual = await Toggle.__test__.toggleCheckbox(mock, 'selector', 'label', true);
      expect(actual).toBeTruthy();
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), true);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s is %schecked for %s',
        'selector', '', 'label');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, mock.element);
      expect(this.context.prop).toHaveBeenCalledTimes(1);
      expect(this.context.prop).toHaveBeenNthCalledWith(1, 'checked', true);
      expect(this.context.trigger).toHaveBeenCalledTimes(2);
      expect(this.context.trigger).toHaveBeenNthCalledWith(1, 'change');
      expect(this.context.trigger).toHaveBeenNthCalledWith(2, 'focusout');
    });

    it('should use default value and return truthy', async () => {
      this.action = '';
      this.context.length = 1;
      const actual = await Toggle.__test__.toggleCheckbox(mock, 'selector');
      expect(actual).toBeTruthy();
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), false);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s is %schecked for %s',
        'selector', 'un', 'toggle');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, mock.element);
      expect(this.context.prop).toHaveBeenCalledTimes(1);
      expect(this.context.prop).toHaveBeenNthCalledWith(1, 'checked', false);
      expect(this.context.trigger).toHaveBeenCalledTimes(2);
      expect(this.context.trigger).toHaveBeenNthCalledWith(1, 'change');
      expect(this.context.trigger).toHaveBeenNthCalledWith(2, 'focusout');
    });

    it('should return falsy', async () => {
      this.action = '';
      this.context.length = 0;
      const actual = await Toggle.__test__.toggleCheckbox(mock, 'selector', 'label', true);
      expect(actual).toBeFalsy();
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), true);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s for %s not found', 'selector', 'label');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, mock.element);
      expect(this.context.prop).toHaveBeenCalledTimes(1);
      expect(this.context.prop).toHaveBeenNthCalledWith(1, 'checked', true);
      expect(this.context.trigger).toHaveBeenCalledTimes(2);
      expect(this.context.trigger).toHaveBeenNthCalledWith(1, 'change');
      expect(this.context.trigger).toHaveBeenNthCalledWith(2, 'focusout');
    });

    it('should log error', async () => {
      this.action = 'error';
      this.context.length = 1;
      const actual = await Toggle.__test__.toggleCheckbox(mock, 'selector', 'label', true);
      expect(actual).toBeFalsy();
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), true);
      expect(mock.debug).toHaveBeenCalledTimes(2);
      expect(mock.debug).toHaveBeenNthCalledWith(1, 'toggle.checkbox %s for %s error: %s',
        'selector', 'label', expect.any(Error));
      expect(mock.debug).toHaveBeenNthCalledWith(2, '%s for %s not found', 'selector', 'label');
      expect(angular.element).not.toHaveBeenCalled();
      expect(this.context.prop).not.toHaveBeenCalled();
      expect(this.context.trigger).not.toHaveBeenCalled();
    });
  });

  describe('toggleSelectByText', () => {
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
      mock.element = {
        options: [
          { text: 'value' },
          { text: 'value2' },
        ],
      };
      const actual = await Toggle.__test__.toggleSelectByText(mock,
        'selector', ['value'], 'label', true);
      expect(actual).toBeTruthy();
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector',
        expect.any(Function), ['value'], true);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s to %sselected on %s for %s',
        'value', '', 'selector', 'label');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, mock.element);
      expect(this.context.trigger).toHaveBeenCalledTimes(2);
      expect(this.context.trigger).toHaveBeenNthCalledWith(1, 'change');
      expect(this.context.trigger).toHaveBeenNthCalledWith(2, 'focusout');
    });

    it('should use default value and return truthy', async () => {
      this.action = '';
      this.context.length = 1;
      mock.element = null;
      const actual = await Toggle.__test__.toggleSelectByText(mock, 'selector');
      expect(actual).toBeTruthy();
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector',
        expect.any(Function), [], false);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s to %sselected on %s for %s',
        '', 'de', 'selector', 'toggle');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, mock.element);
      expect(this.context.trigger).toHaveBeenCalledTimes(2);
      expect(this.context.trigger).toHaveBeenNthCalledWith(1, 'change');
      expect(this.context.trigger).toHaveBeenNthCalledWith(2, 'focusout');
    });

    it('should return falsy', async () => {
      this.action = '';
      this.context.length = 0;
      mock.element = null;
      const actual = await Toggle.__test__.toggleSelectByText(mock, 'selector', 'value');
      expect(actual).toBeFalsy();
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector',
        expect.any(Function), ['value'], false);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s for %s not found', 'selector', 'toggle');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, mock.element);
      expect(this.context.trigger).toHaveBeenCalledTimes(2);
      expect(this.context.trigger).toHaveBeenNthCalledWith(1, 'change');
      expect(this.context.trigger).toHaveBeenNthCalledWith(2, 'focusout');
    });

    it('should log error', async () => {
      this.action = 'error';
      this.context.length = 1;
      mock.element = null;
      const actual = await Toggle.__test__.toggleSelectByText(mock, 'selector', 'value');
      expect(actual).toBeFalsy();
      expect(mock.$eval).toHaveBeenCalledTimes(1);
      expect(mock.$eval).toHaveBeenNthCalledWith(1, 'selector',
        expect.any(Function), ['value'], false);
      expect(mock.debug).toHaveBeenCalledTimes(2);
      expect(mock.debug).toHaveBeenNthCalledWith(1, 'toggle.select %s for %s error: %s',
        'selector', 'toggle', expect.any(Error));
      expect(mock.debug).toHaveBeenNthCalledWith(2, '%s for %s not found', 'selector', 'toggle');
      expect(angular.element).not.toHaveBeenCalled();
      expect(this.context.trigger).not.toHaveBeenCalled();
    });
  });
});
