/*!
 *  Wait.test.js - tests for Wait functionality.
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

const Wait = require('../lib/Wait.js');

const mock = {
  browser: jest.fn(() => ({
    on: mock.browserOn,
    removeListener: mock.browserRemoveListener,
  })),
  browserOn: jest.fn((topic, callback) => {
    mock.data[topic] = setTimeout(callback,
      Math.floor(Math.random() * (25 - 10 + 1) + 10), { _targetId: 'target' });
  }),
  browserRemoveListener: jest.fn((topic) => clearTimeout(mock.data[topic])),
  data: {},
  debug: jest.spyOn(Wait.__test__.logger, 'debug'),
  evaluate: jest.fn((callback, timeout) => new Promise((resolve, reject) => {
    if (this.evaluateAction === 'error') {
      reject(Error('error'));
    } else {
      callback(timeout > 100 ? 100 : timeout).then(resolve);
    }
  })),
  settledOrTimedout: jest.spyOn(Wait.__test__, 'untilSettledOrTimedOut')
    .mockImplementation((executor, timeoutExecutor, timeout) => new Promise((resolve, reject) => {
      let pending = true;
      setTimeout(() => {
        pending = false;
        timeoutExecutor(resolve, reject);
      }, timeout > 100 ? 100 : timeout);
      executor(resolve, reject, () => pending);
    })),
  target: jest.fn(() => ({ _targetId: 'target' })),
  waitFor: jest.fn((input, options = {}) => new Promise((resolve, reject) => {
    if (this.waitForAction === 'error') {
      reject(Error('error'));
    } else if (typeof (input) === 'function') {
      setTimeout(() => resolve(input()), options.timeout > 100 ? 100 : options.timeout);
    }
  })),
};

describe('Wait module test', () => {
  describe('untilActionReady', () => {
    beforeAll(() => {
      this.waitUntilAngularReady = jest.spyOn(Wait.__test__, 'untilAngularReady')
        .mockImplementation(() => {});
      this.waitUntilPageReady = jest.spyOn(Wait.__test__, 'untilPageReady')
        .mockImplementation(() => {});
      this.waitUntilTargetReady = jest.spyOn(Wait.__test__, 'untilTargetReady')
        .mockImplementation(() => {});
    });

    afterAll(() => {
      this.waitUntilAngularReady.mockRestore();
      this.waitUntilAngularReady = null;
      this.waitUntilPageReady.mockRestore();
      this.waitUntilPageReady = null;
      this.waitUntilTargetReady.mockRestore();
      this.waitUntilTargetReady = null;
    });

    it('should return resolved', async () => {
      await Wait.untilActionReady(100);
      expect(this.waitUntilTargetReady).toHaveBeenCalledTimes(1);
      expect(this.waitUntilTargetReady).toHaveBeenNthCalledWith(1, Wait, 20);
      expect(this.waitUntilPageReady).toHaveBeenCalledTimes(1);
      expect(this.waitUntilPageReady).toHaveBeenNthCalledWith(1, Wait, 40);
      expect(this.waitUntilAngularReady).toHaveBeenCalledTimes(1);
      expect(this.waitUntilAngularReady).toHaveBeenNthCalledWith(1, Wait, 100);
      expect(mock.debug).toHaveBeenCalledTimes(3);
      expect(mock.debug).toHaveBeenNthCalledWith(1, 'target is ready');
      expect(mock.debug).toHaveBeenNthCalledWith(2, 'page is ready');
      expect(mock.debug).toHaveBeenNthCalledWith(3, 'angular is ready');
    });

    it('should use default value and return resolved', async () => {
      await Wait.untilActionReady();
      expect(this.waitUntilTargetReady).toHaveBeenCalledTimes(1);
      expect(this.waitUntilTargetReady).toHaveBeenNthCalledWith(1, Wait, 5000);
      expect(this.waitUntilPageReady).toHaveBeenCalledTimes(1);
      expect(this.waitUntilPageReady).toHaveBeenNthCalledWith(1, Wait, 10000);
      expect(this.waitUntilAngularReady).toHaveBeenCalledTimes(1);
      expect(this.waitUntilAngularReady).toHaveBeenNthCalledWith(1, Wait, 25000);
      expect(mock.debug).toHaveBeenCalledTimes(3);
      expect(mock.debug).toHaveBeenNthCalledWith(1, 'target is ready');
      expect(mock.debug).toHaveBeenNthCalledWith(2, 'page is ready');
      expect(mock.debug).toHaveBeenNthCalledWith(3, 'angular is ready');
    });
  });

  describe('untilAngularReady', () => {
    beforeAll(() => {
      this.waitUntilAngularReady = jest.spyOn(Wait.__test__, 'untilAngularReady')
        .mockImplementation(() => {});
    });

    afterAll(() => {
      this.waitUntilAngularReady.mockRestore();
      this.waitUntilAngularReady = null;
    });

    it('should return resolved', async () => {
      await Wait.untilAngularReady(100);
      expect(this.waitUntilAngularReady).toHaveBeenCalledTimes(1);
      expect(this.waitUntilAngularReady).toHaveBeenNthCalledWith(1, Wait, 100);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, 'angular is ready');
    });

    it('should use default value and return resolved', async () => {
      await Wait.untilAngularReady();
      expect(this.waitUntilAngularReady).toHaveBeenCalledTimes(1);
      expect(this.waitUntilAngularReady).toHaveBeenNthCalledWith(1, Wait, 25000);
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, 'angular is ready');
    });
  });

  describe('Helpers.untilAngularReady', () => {
    beforeAll(() => {
      this.context = [];
      this.context.notifyWhenNoOutstandingRequests = jest.fn((callback) => {
        setTimeout(callback, this.evaluateTimeout);
        return this.context;
      });
      this.evaluateTimeout = 10;
      this.injector = jest.fn(() => this.context);
      global.document = {
        querySelector: jest.fn(() => {}),
      };
      global.window = {};
    });

    afterAll(() => {
      global.angular = null;
      global.document = null;
      global.window = null;
      this.context = null;
      this.injector = null;
    });

    it('should return truthy', async () => {
      this.evaluateAction = '';
      this.context.get = jest.fn(() => this.context);
      this.context.injector = jest.fn(() => this.context);
      global.angular = {
        element: jest.fn(() => this.context),
        injector: jest.fn(() => this.context),
      };
      global.window.angular = global.angular;
      const actual = await Wait.__test__.untilAngularReady(mock, 100);
      expect(actual).toBeTruthy();
      expect(mock.evaluate).toHaveBeenCalledTimes(1);
      expect(mock.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 100);
      expect(document.querySelector).toHaveBeenCalledTimes(1);
      expect(document.querySelector).toHaveBeenNthCalledWith(1, '[data-ng-app],[ng-app],.ng-scope');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, document);
      expect(this.context.injector).toHaveBeenCalledTimes(1);
      expect(this.context.get).toHaveBeenCalledTimes(1);
      expect(this.context.get).toHaveBeenNthCalledWith(1, '$browser');
      expect(this.context.notifyWhenNoOutstandingRequests).toHaveBeenCalledTimes(1);
      expect(this.context.notifyWhenNoOutstandingRequests).toHaveBeenNthCalledWith(1,
        expect.any(Function));
    });

    it('should return truthy on non-angular page', async () => {
      this.evaluateAction = '';
      global.angular = null;
      global.window.angular = global.angular;
      const actual = await Wait.__test__.untilAngularReady(mock, 100);
      expect(actual).toBeTruthy();
      expect(mock.evaluate).toHaveBeenCalledTimes(1);
      expect(mock.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 100);
      expect(document.querySelector).not.toHaveBeenCalled();
      expect(this.context.injector).not.toHaveBeenCalled();
      expect(this.context.get).not.toHaveBeenCalled();
      expect(this.context.notifyWhenNoOutstandingRequests).not.toHaveBeenCalled();
    });

    it('should use default value and return truthy', async () => {
      this.evaluateAction = '';
      this.context.get = null;
      this.context.injector = jest.fn(() => {});
      global.angular = {
        element: jest.fn(() => this.context),
        injector: jest.fn(() => this.injector),
      };
      global.window.angular = global.angular;
      const actual = await Wait.__test__.untilAngularReady(mock);
      expect(actual).toBeTruthy();
      expect(mock.evaluate).toHaveBeenCalledTimes(1);
      expect(mock.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 25000);
      expect(document.querySelector).toHaveBeenCalledTimes(1);
      expect(document.querySelector).toHaveBeenNthCalledWith(1, '[data-ng-app],[ng-app],.ng-scope');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, document);
      expect(this.context.injector).toHaveBeenCalledTimes(1);
      expect(this.injector).toHaveBeenCalledTimes(1);
      expect(this.injector).toHaveBeenNthCalledWith(1, '$browser');
      expect(this.context.notifyWhenNoOutstandingRequests).toHaveBeenCalledTimes(1);
      expect(this.context.notifyWhenNoOutstandingRequests).toHaveBeenNthCalledWith(1,
        expect.any(Function));
    });

    it('should return falsy', async () => {
      this.evaluateAction = '';
      this.context.get = jest.fn(() => this.context);
      this.context.injector = jest.fn(() => this.context);
      global.angular = {
        element: jest.fn(() => this.context),
        injector: jest.fn(() => this.context),
      };
      global.window.angular = global.angular;
      const actual = await Wait.__test__.untilAngularReady(mock, 5);
      expect(actual).toBeFalsy();
      expect(mock.evaluate).toHaveBeenCalledTimes(1);
      expect(mock.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 5);
      expect(document.querySelector).toHaveBeenCalledTimes(1);
      expect(document.querySelector).toHaveBeenNthCalledWith(1, '[data-ng-app],[ng-app],.ng-scope');
      expect(angular.element).toHaveBeenCalledTimes(1);
      expect(angular.element).toHaveBeenNthCalledWith(1, document);
      expect(this.context.injector).toHaveBeenCalledTimes(1);
      expect(this.context.get).toHaveBeenCalledTimes(1);
      expect(this.context.get).toHaveBeenNthCalledWith(1, '$browser');
      expect(this.context.notifyWhenNoOutstandingRequests).toHaveBeenCalledTimes(1);
      expect(this.context.notifyWhenNoOutstandingRequests).toHaveBeenNthCalledWith(1,
        expect.any(Function));
    });

    it('should log error', async () => {
      this.evaluateAction = 'error';
      this.context.get = jest.fn(() => {});
      this.context.injector = jest.fn(() => {});
      global.angular = {
        element: jest.fn(() => this.context),
        injector: jest.fn(() => this.context),
      };
      global.window.angular = global.angular;
      const actual = await Wait.__test__.untilAngularReady(mock, 5);
      expect(actual).toBeFalsy();
      expect(mock.evaluate).toHaveBeenCalledTimes(1);
      expect(mock.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 5);
      expect(document.querySelector).not.toHaveBeenCalled();
      expect(angular.element).not.toHaveBeenCalled();
      expect(this.context.injector).not.toHaveBeenCalled();
      expect(this.context.get).not.toHaveBeenCalled();
      expect(this.context.notifyWhenNoOutstandingRequests).not.toHaveBeenCalled();
    });
  });

  describe('Helpers.untilPageReady', () => {
    beforeAll(() => {
      global.document = {
        readyState: 'complete',
      };
    });

    afterAll(() => {
      global.document = null;
    });

    it('should return truthy', async () => {
      this.waitForAction = '';
      global.document.readyState = 'complete';
      const actual = await Wait.__test__.untilPageReady(mock, 100);
      expect(actual).toBeTruthy();
      expect(mock.waitFor).toHaveBeenCalledTimes(1);
      expect(mock.waitFor).toHaveBeenNthCalledWith(1, expect.any(Function), { timeout: 100 });
    });

    it('should use default value and return truthy', async () => {
      this.waitForAction = '';
      global.document.readyState = 'complete';
      const actual = await Wait.__test__.untilPageReady(mock);
      expect(actual).toBeTruthy();
      expect(mock.waitFor).toHaveBeenCalledTimes(1);
      expect(mock.waitFor).toHaveBeenNthCalledWith(1, expect.any(Function), { timeout: 10000 });
    });

    it('should return falsy', async () => {
      this.waitForAction = '';
      global.document.readyState = '';
      const actual = await Wait.__test__.untilPageReady(mock);
      expect(actual).toBeFalsy();
      expect(mock.waitFor).toHaveBeenCalledTimes(1);
      expect(mock.waitFor).toHaveBeenNthCalledWith(1, expect.any(Function), { timeout: 10000 });
    });

    it('should log error', async () => {
      this.waitForAction = 'error';
      global.document.readyState = 'complete';
      const actual = await Wait.__test__.untilPageReady(mock);
      expect(actual).toBeFalsy();
      expect(mock.waitFor).toHaveBeenCalledTimes(1);
      expect(mock.waitFor).toHaveBeenNthCalledWith(1, expect.any(Function), { timeout: 10000 });
      expect(mock.debug).toHaveBeenCalledTimes(1);
      expect(mock.debug).toHaveBeenNthCalledWith(1, 'untilPageReady error: %s', expect.any(Error));
    });
  });

  describe('Helpers.untilTargetReady', () => {
    it('should return truthy', async () => {
      const actual = await Wait.__test__.untilTargetReady(mock, 100);
      expect(actual).toBeTruthy();
      expect(mock.browser).toHaveBeenCalledTimes(1);
      expect(mock.target).toHaveBeenCalledTimes(1);
      expect(mock.settledOrTimedout).toHaveBeenCalledTimes(1);
      expect(mock.settledOrTimedout).toHaveBeenNthCalledWith(1,
        expect.any(Function), expect.any(Function), 100);
      expect(mock.browserOn).toHaveBeenCalledTimes(2);
      expect(mock.browserOn).toHaveBeenNthCalledWith(1, 'targetcreated', expect.any(Function));
      expect(mock.browserOn).toHaveBeenNthCalledWith(2, 'targetchanged', expect.any(Function));
      expect(mock.browserRemoveListener).toHaveBeenCalledTimes(2);
      expect(mock.browserRemoveListener).toHaveBeenNthCalledWith(1, 'targetcreated', expect.any(Function));
      expect(mock.browserRemoveListener).toHaveBeenNthCalledWith(2, 'targetchanged', expect.any(Function));
    });

    it('should use default value and return truthy', async () => {
      const actual = await Wait.__test__.untilTargetReady(mock);
      expect(actual).toBeTruthy();
      expect(mock.browser).toHaveBeenCalledTimes(1);
      expect(mock.target).toHaveBeenCalledTimes(1);
      expect(mock.settledOrTimedout).toHaveBeenCalledTimes(1);
      expect(mock.settledOrTimedout).toHaveBeenNthCalledWith(1,
        expect.any(Function), expect.any(Function), 25000);
      expect(mock.browserOn).toHaveBeenCalledTimes(2);
      expect(mock.browserOn).toHaveBeenNthCalledWith(1, 'targetcreated', expect.any(Function));
      expect(mock.browserOn).toHaveBeenNthCalledWith(2, 'targetchanged', expect.any(Function));
      expect(mock.browserRemoveListener).toHaveBeenCalledTimes(2);
      expect(mock.browserRemoveListener).toHaveBeenNthCalledWith(1, 'targetcreated', expect.any(Function));
      expect(mock.browserRemoveListener).toHaveBeenNthCalledWith(2, 'targetchanged', expect.any(Function));
    });

    it('should return falsy', async () => {
      const actual = await Wait.__test__.untilTargetReady(mock, 5);
      expect(actual).toBeFalsy();
      expect(mock.browser).toHaveBeenCalledTimes(1);
      expect(mock.target).toHaveBeenCalledTimes(1);
      expect(mock.settledOrTimedout).toHaveBeenCalledTimes(1);
      expect(mock.settledOrTimedout).toHaveBeenNthCalledWith(1,
        expect.any(Function), expect.any(Function), 5);
      expect(mock.browserOn).toHaveBeenCalledTimes(2);
      expect(mock.browserOn).toHaveBeenNthCalledWith(1, 'targetcreated', expect.any(Function));
      expect(mock.browserOn).toHaveBeenNthCalledWith(2, 'targetchanged', expect.any(Function));
      expect(mock.browserRemoveListener).toHaveBeenCalledTimes(2);
      expect(mock.browserRemoveListener).toHaveBeenNthCalledWith(1, 'targetcreated', expect.any(Function));
      expect(mock.browserRemoveListener).toHaveBeenNthCalledWith(2, 'targetchanged', expect.any(Function));
    });
  });
});
