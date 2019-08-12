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

const createMocks = ({
  evalAction = '',
} = {}) => {
  const mocks = {
    ...{
      evalAction,
    },
    ...{
      $eval: jest.fn((selector, callback, ...args) => new Promise((resolve, reject) => {
        if (mocks.evalAction === 'error') {
          reject(Error('error'));
        } else {
          resolve(callback(mocks.element, ...args));
        }
      })),
      debug: jest.spyOn(Toggle.__test__.logger, 'debug'),
      element: {
        dispatchEvent: jest.fn(() => {}),
      },
    },
  };
  return mocks;
};

const evtInit = {
  bubbles: true,
  cancelable: true,
};

global.Event = jest.fn(() => {});

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
    it('should return truthy', async () => {
      const mocks = createMocks();
      const actual = await Toggle.__test__.toggleCheckbox(mocks, 'selector', 'label', true);
      expect(actual).toBeTruthy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), true);
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s is %schecked for %s',
        'selector', '', 'label');
      expect(mocks.element.checked).toBeTruthy();
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(3);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(2, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(3, expect.any(global.Event));
      expect(global.Event).toHaveBeenCalledTimes(3);
      expect(global.Event).toHaveBeenNthCalledWith(1, 'focus', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(2, 'change', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(3, 'blur', evtInit);
    });

    it('should use default value and return truthy', async () => {
      const mocks = createMocks();
      const actual = await Toggle.__test__.toggleCheckbox(mocks, 'selector');
      expect(actual).toBeTruthy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), false);
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s is %schecked for %s',
        'selector', 'un', 'toggle');
      expect(mocks.element.checked).toBeFalsy();
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(3);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(2, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(3, expect.any(global.Event));
      expect(global.Event).toHaveBeenCalledTimes(3);
      expect(global.Event).toHaveBeenNthCalledWith(1, 'focus', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(2, 'change', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(3, 'blur', evtInit);
    });

    it('should log error', async () => {
      const mocks = createMocks({ evalAction: 'error' });
      const actual = await Toggle.__test__.toggleCheckbox(mocks, 'selector', 'label', true);
      expect(actual).toBeFalsy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), true);
      expect(mocks.debug).toHaveBeenCalledTimes(2);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, 'toggle.checkbox %s for %s error: %s',
        'selector', 'label', expect.any(Error));
      expect(mocks.debug).toHaveBeenNthCalledWith(2, '%s for %s not found', 'selector', 'label');
      expect(mocks.element.checked).toBeFalsy();
      expect(mocks.element.dispatchEvent).not.toHaveBeenCalled();
      expect(global.Event).not.toHaveBeenCalled();
    });
  });

  describe('toggleSelectByText', () => {
    it('should return truthy', async () => {
      const mocks = createMocks();
      mocks.element.options = [
        { text: 'value' },
        { text: 'value2' },
      ];
      const actual = await Toggle.__test__.toggleSelectByText(mocks,
        'selector', ['value'], 'label', true);
      expect(actual).toBeTruthy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector',
        expect.any(Function), ['value'], true);
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s to %sselected on %s for %s',
        'value', '', 'selector', 'label');
      expect(mocks.element.options[0].selected).toBeTruthy();
      expect(mocks.element.options[1].selected).toBeFalsy();
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(3);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(2, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(3, expect.any(global.Event));
      expect(global.Event).toHaveBeenCalledTimes(3);
      expect(global.Event).toHaveBeenNthCalledWith(1, 'focus', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(2, 'change', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(3, 'blur', evtInit);
    });

    it('should use default value and return truthy', async () => {
      const mocks = createMocks();
      const actual = await Toggle.__test__.toggleSelectByText(mocks, 'selector');
      expect(actual).toBeTruthy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector',
        expect.any(Function), [], false);
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s to %sselected on %s for %s',
        '', 'de', 'selector', 'toggle');
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(3);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(2, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(3, expect.any(global.Event));
      expect(global.Event).toHaveBeenCalledTimes(3);
      expect(global.Event).toHaveBeenNthCalledWith(1, 'focus', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(2, 'change', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(3, 'blur', evtInit);
    });

    it('should use given non-array value and return truthy', async () => {
      const mocks = createMocks();
      const actual = await Toggle.__test__.toggleSelectByText(mocks, 'selector', 'value');
      expect(actual).toBeTruthy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector',
        expect.any(Function), ['value'], false);
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s to %sselected on %s for %s', 'value',
        'de', 'selector', 'toggle');
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(3);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(2, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(3, expect.any(global.Event));
      expect(global.Event).toHaveBeenCalledTimes(3);
      expect(global.Event).toHaveBeenNthCalledWith(1, 'focus', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(2, 'change', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(3, 'blur', evtInit);
    });

    it('should log error', async () => {
      const mocks = createMocks({ evalAction: 'error' });
      const actual = await Toggle.__test__.toggleSelectByText(mocks, 'selector', 'value');
      expect(actual).toBeFalsy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector',
        expect.any(Function), ['value'], false);
      expect(mocks.debug).toHaveBeenCalledTimes(2);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, 'toggle.select %s for %s error: %s',
        'selector', 'toggle', expect.any(Error));
      expect(mocks.debug).toHaveBeenNthCalledWith(2, '%s for %s not found', 'selector', 'toggle');
      expect(mocks.element.dispatchEvent).not.toHaveBeenCalled();
      expect(global.Event).not.toHaveBeenCalled();
    });
  });
});
