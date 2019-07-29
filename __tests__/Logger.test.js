/*!
 *  Logger.test.js - tests for Logger functionality.
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

const Logger = require('../lib/Logger.js');

describe('Logger module test', () => {
  describe('constructor', () => {
    it('should return expected', () => {
      const actual = new Logger('namespace');
      expect(actual.debugNamespace).toEqual(expect.objectContaining({
        destroy: expect.any(Function),
        extend: expect.any(Function),
        namespace: 'namespace',
      }));
    });
  });

  describe('destroy', () => {
    it('should destroy member variables', () => {
      const actual = new Logger('namespace');
      const mockDestroy = jest.spyOn(actual.debugNamespace, 'destroy');
      actual.destroy();
      expect(actual.debugNamespace).toBeNull();
      expect(mockDestroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('debug', () => {
    it('should log message', () => {
      const actual = new Logger('namespace');
      const mockDebug = jest.spyOn(actual, 'debugNamespace')
        .mockImplementation(() => {});
      const mockIsNegligibleValue = jest.spyOn(Logger.__test__, 'isNegligibleValue');
      expect(actual.debug('%s %s', 'message', 'value')).toBeNull();
      expect(mockIsNegligibleValue).toHaveBeenCalledTimes(1);
      expect(mockIsNegligibleValue).toHaveBeenNthCalledWith(1, 'value');
      expect(mockDebug).toHaveBeenCalledTimes(1);
      expect(mockDebug).toHaveBeenNthCalledWith(1, '%s %s', 'message', 'value');
    });

    it('should not log message', () => {
      const actual = new Logger('namespace');
      const mockDebug = jest.spyOn(actual, 'debugNamespace')
        .mockImplementation(() => {});
      const mockIsNegligibleValue = jest.spyOn(Logger.__test__, 'isNegligibleValue');
      expect(actual.debug('%s %s', 'message', Error('Target closed'))).toBeNull();
      expect(mockIsNegligibleValue).toHaveBeenCalledTimes(1);
      expect(mockIsNegligibleValue).toHaveBeenNthCalledWith(1, Error('Target closed'));
      expect(mockDebug).not.toHaveBeenCalled();
    });
  });

  describe('debugAndReturn', () => {
    it('should log message and return undefined', () => {
      const actual = new Logger('namespace');
      const mockDebug = jest.spyOn(actual, 'debugNamespace')
        .mockImplementation(() => {});
      const mockIsNegligibleValue = jest.spyOn(Logger.__test__, 'isNegligibleValue');
      expect(actual.debugAndReturn(undefined, '%s %s', 'message', 'value')).toBeUndefined();
      expect(mockIsNegligibleValue).toHaveBeenCalledTimes(1);
      expect(mockIsNegligibleValue).toHaveBeenNthCalledWith(1, 'value');
      expect(mockDebug).toHaveBeenCalledTimes(1);
      expect(mockDebug).toHaveBeenNthCalledWith(1, '%s %s', 'message', 'value');
    });

    it('should log message and return null', () => {
      const actual = new Logger('namespace');
      const mockDebug = jest.spyOn(actual, 'debugNamespace')
        .mockImplementation(() => {});
      const mockIsNegligibleValue = jest.spyOn(Logger.__test__, 'isNegligibleValue');
      expect(actual.debugAndReturn(null, '%s %s', 'message', 'value')).toBeNull();
      expect(mockIsNegligibleValue).toHaveBeenCalledTimes(1);
      expect(mockIsNegligibleValue).toHaveBeenNthCalledWith(1, 'value');
      expect(mockDebug).toHaveBeenCalledTimes(1);
      expect(mockDebug).toHaveBeenNthCalledWith(1, '%s %s', 'message', 'value');
    });

    it('should log message and return falsy', () => {
      const actual = new Logger('namespace');
      const mockDebug = jest.spyOn(actual, 'debugNamespace')
        .mockImplementation(() => {});
      const mockIsNegligibleValue = jest.spyOn(Logger.__test__, 'isNegligibleValue');
      expect(actual.debugAndReturn(false, '%s %s', 'message', 'value')).toBeFalsy();
      expect(mockIsNegligibleValue).toHaveBeenCalledTimes(1);
      expect(mockIsNegligibleValue).toHaveBeenNthCalledWith(1, 'value');
      expect(mockDebug).toHaveBeenCalledTimes(1);
      expect(mockDebug).toHaveBeenNthCalledWith(1, '%s %s', 'message', 'value');
    });

    it('should log message and return numbers', () => {
      const actual = new Logger('namespace');
      const mockDebug = jest.spyOn(actual, 'debugNamespace')
        .mockImplementation(() => {});
      const mockIsNegligibleValue = jest.spyOn(Logger.__test__, 'isNegligibleValue');
      expect(actual.debugAndReturn(0, '%s %s', 'message', 'value')).toEqual(0);
      expect(mockIsNegligibleValue).toHaveBeenCalledTimes(1);
      expect(mockIsNegligibleValue).toHaveBeenNthCalledWith(1, 'value');
      expect(mockDebug).toHaveBeenCalledTimes(1);
      expect(mockDebug).toHaveBeenNthCalledWith(1, '%s %s', 'message', 'value');
    });

    it('should log message and return string', () => {
      const actual = new Logger('namespace');
      const mockDebug = jest.spyOn(actual, 'debugNamespace')
        .mockImplementation(() => {});
      const mockIsNegligibleValue = jest.spyOn(Logger.__test__, 'isNegligibleValue');
      expect(actual.debugAndReturn('', '%s %s', 'message', 'value')).toEqual('');
      expect(mockIsNegligibleValue).toHaveBeenCalledTimes(1);
      expect(mockIsNegligibleValue).toHaveBeenNthCalledWith(1, 'value');
      expect(mockDebug).toHaveBeenCalledTimes(1);
      expect(mockDebug).toHaveBeenNthCalledWith(1, '%s %s', 'message', 'value');
    });

    it('should log message and return array', () => {
      const actual = new Logger('namespace');
      const mockDebug = jest.spyOn(actual, 'debugNamespace')
        .mockImplementation(() => {});
      const mockIsNegligibleValue = jest.spyOn(Logger.__test__, 'isNegligibleValue');
      expect(actual.debugAndReturn([], '%s %s', 'message', 'value')).toEqual([]);
      expect(mockIsNegligibleValue).toHaveBeenCalledTimes(1);
      expect(mockIsNegligibleValue).toHaveBeenNthCalledWith(1, 'value');
      expect(mockDebug).toHaveBeenCalledTimes(1);
      expect(mockDebug).toHaveBeenNthCalledWith(1, '%s %s', 'message', 'value');
    });

    it('should log message and return object', () => {
      const actual = new Logger('namespace');
      const mockDebug = jest.spyOn(actual, 'debugNamespace')
        .mockImplementation(() => {});
      const mockIsNegligibleValue = jest.spyOn(Logger.__test__, 'isNegligibleValue');
      expect(actual.debugAndReturn({}, '%s %s', 'message', 'value')).toEqual({});
      expect(mockIsNegligibleValue).toHaveBeenCalledTimes(1);
      expect(mockIsNegligibleValue).toHaveBeenNthCalledWith(1, 'value');
      expect(mockDebug).toHaveBeenCalledTimes(1);
      expect(mockDebug).toHaveBeenNthCalledWith(1, '%s %s', 'message', 'value');
    });
  });

  describe('isNegligibleValue', () => {
    it('should return truthy', () => {
      expect(Logger.__test__.isNegligibleValue(Error('Cannot find context'))).toBeTruthy();
      expect(Logger.__test__.isNegligibleValue(Error('context was destroyed'))).toBeTruthy();
      expect(Logger.__test__.isNegligibleValue(Error('failed to find element'))).toBeTruthy();
      expect(Logger.__test__.isNegligibleValue(Error('pool is draining'))).toBeTruthy();
      expect(Logger.__test__.isNegligibleValue(Error('Resource not currently part of this pool'))).toBeTruthy();
      expect(Logger.__test__.isNegligibleValue(Error('Session closed'))).toBeTruthy();
      expect(Logger.__test__.isNegligibleValue(Error('Target closed'))).toBeTruthy();
    });

    it('should return falsy', () => {
      expect(Logger.__test__.isNegligibleValue()).toBeFalsy();
      expect(Logger.__test__.isNegligibleValue(null)).toBeFalsy();
      expect(Logger.__test__.isNegligibleValue('message')).toBeFalsy();
      expect(Logger.__test__.isNegligibleValue(0)).toBeFalsy();
      expect(Logger.__test__.isNegligibleValue(false)).toBeFalsy();
      expect(Logger.__test__.isNegligibleValue([])).toBeFalsy();
      expect(Logger.__test__.isNegligibleValue({})).toBeFalsy();
      expect(Logger.__test__.isNegligibleValue(Error('error'))).toBeFalsy();
    });
  });
});
