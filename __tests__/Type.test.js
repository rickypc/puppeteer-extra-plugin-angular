/*!
 *  Type.test.js - tests for Type functionality.
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

const Type = require('../lib/Type.js');

const createMocks = ({
  evalAction = '',
  type = 'text',
} = {}) => {
  const mocks = Object.assign({
    evalAction,
    type,
  }, {
    $eval: jest.fn((selector, callback, value) => new Promise(async (resolve, reject) => {
      if (mocks.evalAction === 'error') {
        reject(Error('error'));
      } else {
        resolve(callback(mocks.element, value));
      }
    })),
    debug: jest.spyOn(Type.__test__.logger, 'debug'),
    element: {
      dispatchEvent: jest.fn(() => {}),
      type,
    },
  });
  return mocks;
};

const evtInit = {
  bubbles: true,
  cancelable: true,
};

global.Event = jest.fn(() => {});

describe('Type module test', () => {
  describe('ifExists', () => {
    it('should return truthy', async () => {
      const mocks = createMocks();
      const actual = await Type.ifExists.call(mocks, 'selector', 'value', 'label');
      expect(actual).toBeTruthy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), 'value');
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s on %s for %s', 'value',
        'selector', 'label');
      expect(mocks.element.value).toEqual('value');
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(8);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(2, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(3, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(4, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(5, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(6, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(7, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(8, expect.any(global.Event));
      expect(global.Event).toHaveBeenCalledTimes(8);
      expect(global.Event).toHaveBeenNthCalledWith(1, 'focus', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(2, 'reset', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(3, 'keydown', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(4, 'keypress', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(5, 'keyup', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(6, 'input', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(7, 'change', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(8, 'blur', evtInit);
    });

    it('should masked password value and return truthy', async () => {
      const mocks = createMocks({ type: 'password' });
      const actual = await Type.ifExists.call(mocks, 'selector', 'value', 'label');
      expect(actual).toBeTruthy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), 'value');
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s on %s for %s',
        '*****', 'selector', 'label');
      expect(mocks.element.value).toEqual('value');
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(8);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(2, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(3, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(4, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(5, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(6, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(7, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(8, expect.any(global.Event));
      expect(global.Event).toHaveBeenCalledTimes(8);
      expect(global.Event).toHaveBeenNthCalledWith(1, 'focus', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(2, 'reset', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(3, 'keydown', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(4, 'keypress', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(5, 'keyup', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(6, 'input', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(7, 'change', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(8, 'blur', evtInit);
    });

    it('should use default value and return truthy', async () => {
      const mocks = createMocks();
      const actual = await Type.ifExists.call(mocks, 'selector');
      expect(actual).toBeTruthy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), '');
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s on %s for %s', '', 'selector', 'type');
      expect(mocks.element.value).toEqual('');
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(8);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(2, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(3, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(4, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(5, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(6, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(7, expect.any(global.Event));
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(8, expect.any(global.Event));
      expect(global.Event).toHaveBeenCalledTimes(8);
      expect(global.Event).toHaveBeenNthCalledWith(1, 'focus', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(2, 'reset', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(3, 'keydown', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(4, 'keypress', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(5, 'keyup', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(6, 'input', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(7, 'change', evtInit);
      expect(global.Event).toHaveBeenNthCalledWith(8, 'blur', evtInit);
    });

    it('should log error', async () => {
      const mocks = createMocks({ evalAction: 'error' });
      const actual = await Type.ifExists.call(mocks, 'selector', 'value', 'label');
      expect(actual).toBeFalsy();
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function), 'value');
      expect(mocks.debug).toHaveBeenCalledTimes(2);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, 'el.type %s for %s error: %s',
        'selector', 'label', expect.any(Error));
      expect(mocks.debug).toHaveBeenNthCalledWith(2, '%s for %s not found', 'selector', 'label');
      expect(mocks.element.value).toBeUndefined();
      expect(mocks.element.dispatchEvent).not.toHaveBeenCalled();
      expect(global.Event).not.toHaveBeenCalled();
    });
  });
});
