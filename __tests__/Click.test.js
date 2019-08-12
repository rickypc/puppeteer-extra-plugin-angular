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

const createMocks = ({
  $Action = '',
  evalAction = '',
} = {}) => {
  const mocks = {
    ...{
      $Action,
      evalAction,
    },
    ...{
      $: jest.fn(() => (mocks.$Action === 'null' ? null : mocks.element)),
      $eval: jest.fn((selector, callback) => new Promise((resolve, reject) => {
        if (mocks.evalAction === 'error') {
          reject(Error('error'));
        } else {
          resolve(callback(mocks.element));
        }
      })),
      debug: jest.spyOn(Click.__test__.logger, 'debug'),
      element: {
        dispatchEvent: jest.fn(() => {}),
      },
      waitUntilActionReady: jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100))),
    },
  };
  return mocks;
};

const evtInit = {
  bubbles: true,
  cancelable: true,
};

global.MouseEvent = jest.fn(() => {});

describe('Click module test', () => {
  describe('ifExists', () => {
    it('should return truthy', async () => {
      const mocks = createMocks();
      const actual = await Click.ifExists.call(mocks, 'selector', 'label', 200);
      expect(actual).toBeTruthy();
      expect(mocks.$).toHaveBeenCalledTimes(1);
      expect(mocks.$).toHaveBeenNthCalledWith(1, 'selector');
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function));
      expect(mocks.waitUntilActionReady).toHaveBeenCalledTimes(1);
      expect(mocks.waitUntilActionReady).toHaveBeenNthCalledWith(1, 200);
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s for %s', 'selector', 'label');
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(1);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.MouseEvent));
      expect(global.MouseEvent).toHaveBeenCalledTimes(1);
      expect(global.MouseEvent).toHaveBeenNthCalledWith(1, 'click', evtInit);
    });

    it('should use default value and return truthy', async () => {
      const mocks = createMocks();
      const actual = await Click.ifExists.call(mocks, 'selector');
      expect(actual).toBeTruthy();
      expect(mocks.$).toHaveBeenCalledTimes(1);
      expect(mocks.$).toHaveBeenNthCalledWith(1, 'selector');
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function));
      expect(mocks.waitUntilActionReady).toHaveBeenCalledTimes(1);
      expect(mocks.waitUntilActionReady).toHaveBeenNthCalledWith(1, 25000);
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s for %s', 'selector', 'click');
      expect(mocks.element.dispatchEvent).toHaveBeenCalledTimes(1);
      expect(mocks.element.dispatchEvent).toHaveBeenNthCalledWith(1, expect.any(global.MouseEvent));
      expect(global.MouseEvent).toHaveBeenCalledTimes(1);
      expect(global.MouseEvent).toHaveBeenNthCalledWith(1, 'click', evtInit);
    });

    it('should return falsy', async () => {
      const mocks = createMocks({ $Action: 'null' });
      const actual = await Click.ifExists.call(mocks, 'selector', 'label', 200);
      expect(actual).toBeFalsy();
      expect(mocks.$).toHaveBeenCalledTimes(1);
      expect(mocks.$).toHaveBeenNthCalledWith(1, 'selector');
      expect(mocks.$eval).not.toHaveBeenCalled();
      expect(mocks.waitUntilActionReady).not.toHaveBeenCalled();
      expect(mocks.debug).toHaveBeenCalledTimes(1);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s for %s not found', 'selector', 'label');
      expect(mocks.element.dispatchEvent).not.toHaveBeenCalled();
      expect(global.MouseEvent).not.toHaveBeenCalled();
    });

    it('should log error', async () => {
      const mocks = createMocks({ evalAction: 'error' });
      const actual = await Click.ifExists.call(mocks, 'selector', 'label', 200);
      expect(actual).toBeFalsy();
      expect(mocks.$).toHaveBeenCalledTimes(1);
      expect(mocks.$).toHaveBeenNthCalledWith(1, 'selector');
      expect(mocks.$eval).toHaveBeenCalledTimes(1);
      expect(mocks.$eval).toHaveBeenNthCalledWith(1, 'selector', expect.any(Function));
      expect(mocks.waitUntilActionReady).toHaveBeenCalledTimes(1);
      expect(mocks.waitUntilActionReady).toHaveBeenNthCalledWith(1, 200);
      expect(mocks.debug).toHaveBeenCalledTimes(2);
      expect(mocks.debug).toHaveBeenNthCalledWith(1, '%s for %s error: %s',
        'selector', 'label', expect.any(Error));
      expect(mocks.debug).toHaveBeenNthCalledWith(2, '%s for %s not found', 'selector', 'label');
      expect(mocks.element.dispatchEvent).not.toHaveBeenCalled();
      expect(global.MouseEvent).not.toHaveBeenCalled();
    });
  });
});
