/*!
 *  Navigate.test.js - tests for Navigate functionality.
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

const Navigate = require('../lib/Navigate.js');

const mock = {
  debug: jest.spyOn(Navigate.__test__.logger, 'debug'),
  goto: jest.fn(() => new Promise((resolve, reject) => {
    if (this.action === 'error') {
      reject(Error('error'));
    } else {
      resolve();
    }
  })),
  waitUntilActionReady: jest.fn(() => new Promise(resolve => setTimeout(resolve, 100))),
};

describe('Navigate module test', () => {
  describe('untilReady', () => {
    beforeAll(() => {
      this.action = '';
    });

    afterAll(() => {
      this.action = null;
    });

    it('should return resolved', async () => {
      this.action = '';
      await Navigate.untilReady.call(mock, 'url', 200);
      expect(mock.goto).toHaveBeenCalledTimes(1);
      expect(mock.goto).toHaveBeenNthCalledWith(1, 'url', { timeout: 0 });
      expect(mock.waitUntilActionReady).toHaveBeenCalledTimes(1);
      expect(mock.waitUntilActionReady).toHaveBeenNthCalledWith(1, 200);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, 'to %s', 'url');
    });

    it('should use default value and return resolved', async () => {
      this.action = '';
      await Navigate.untilReady.call(mock, 'url');
      expect(mock.goto).toHaveBeenCalledTimes(1);
      expect(mock.goto).toHaveBeenNthCalledWith(1, 'url', { timeout: 0 });
      expect(mock.waitUntilActionReady).toHaveBeenCalledTimes(1);
      expect(mock.waitUntilActionReady).toHaveBeenNthCalledWith(1, 25000);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, 'to %s', 'url');
    });

    it('should log error', async () => {
      this.action = 'error';
      await Navigate.untilReady.call(mock, 'url', 200);
      expect(mock.goto).toHaveBeenCalledTimes(1);
      expect(mock.goto).toHaveBeenNthCalledWith(1, 'url', { timeout: 0 });
      expect(mock.waitUntilActionReady).not.toHaveBeenCalled();
      expect(mock.debug).toHaveBeenNthCalledWith(1, '%s error: %s', 'url', expect.any(Error));
    });
  });
});
