/*!
 *  PromiseTimeout.test.js - tests for PromiseTimeout functionality.
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

const PromiseTimeout = require('../lib/PromiseTimeout.js');

describe('PromiseTimeout module test', () => {
  describe('untilSettledOrTimedOut', () => {
    it('should return resolved', async () => {
      const actual = await PromiseTimeout
        .untilSettledOrTimedOut(async (resolve, reject, pending) => {
          await new Promise(done => setTimeout(done, 10));
          expect(pending()).toBeTruthy();
          resolve('executor');
        }, resolve => resolve('timeout'), 100);
      expect(actual).toEqual('executor');
    });

    it('should return rejected', async () => {
      const actual = await PromiseTimeout
        .untilSettledOrTimedOut(async (resolve, reject, pending) => {
          await new Promise(done => setTimeout(done, 10));
          expect(pending()).toBeTruthy();
          reject('executor');
        }, resolve => resolve('timeout'), 100)
        .catch(ex => expect(ex).toEqual('executor'));
      expect(actual).toBeUndefined();
    });

    it('should return timed out resolved', async () => {
      const actual = await PromiseTimeout
        .untilSettledOrTimedOut(async (resolve, reject, pending) => {
          await new Promise(done => setTimeout(done, 200));
          expect(pending()).toBeFalsy();
          resolve('executor');
        }, resolve => resolve('timeout'), 100);
      expect(actual).toEqual('timeout');
    });

    it('should return timed out rejected', async () => {
      const actual = await PromiseTimeout
        .untilSettledOrTimedOut(async (resolve, reject, pending) => {
          await new Promise(done => setTimeout(done, 200));
          expect(pending()).toBeFalsy();
          resolve('executor');
        }, (resolve, reject) => reject('timeout'), 100)
        .catch(ex => expect(ex).toEqual('timeout'));
      expect(actual).toBeUndefined();
    });
  });
});
