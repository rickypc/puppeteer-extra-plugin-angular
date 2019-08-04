/*!
 *  index.test.js - tests for main module functionality.
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

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin');
const Index = require('../index.js');

describe('Index module test', () => {
  describe('constructor', () => {
    it('should return expected', () => {
      const actual = Index();
      expect(actual instanceof PuppeteerExtraPlugin).toBeTruthy();
      expect(actual.logger.debugNamespace.namespace).toEqual('pepa:index');
    });
  });

  describe('getName', () => {
    it('should return expected', () => {
      const actual = Index();
      expect(actual.name).toEqual('angular');
    });
  });

  describe('onPageCreated', () => {
    it('should setup handlers', () => {
      const actual = Index();
      const context = {};
      const mockDebug = jest.spyOn(actual.logger, 'debug').mockImplementation(() => {});
      actual.onPageCreated(context);
      expect(context).toEqual(expect.objectContaining({
        clickIfExists: expect.any(Function),
        formFillOut: expect.any(Function),
        navigateUntilReady: expect.any(Function),
        toggleCheck: expect.any(Function),
        toggleDeselectByText: expect.any(Function),
        toggleSelectByText: expect.any(Function),
        toggleUncheck: expect.any(Function),
        typeIfExists: expect.any(Function),
        waitUntilActionReady: expect.any(Function),
        waitUntilAngularReady: expect.any(Function),
      }));
      expect(mockDebug).toHaveBeenCalledTimes(1);
      expect(mockDebug).toHaveBeenNthCalledWith(1, 'onPageCreated');
    });
  });
});
