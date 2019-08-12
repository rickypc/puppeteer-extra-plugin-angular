/*!
 *  Form.test.js - tests for Form functionality.
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
const Form = require('../lib/Form.js');
const Toggle = require('../lib/Toggle.js');
const Type = require('../lib/Type.js');

const mock = {
  click: jest.spyOn(Click, 'ifExists').mockImplementation(() => {}),
  fillOutField: jest.spyOn(Form.__test__, 'fillOutField'),
  getValue: jest.spyOn(Form.__test__, 'getValue'),
  toggleCheck: jest.spyOn(Toggle, 'check').mockImplementation(() => {}),
  toggleDeselect: jest.spyOn(Toggle, 'deselectByText').mockImplementation(() => {}),
  toggleSelect: jest.spyOn(Toggle, 'selectByText').mockImplementation(() => {}),
  toggleUncheck: jest.spyOn(Toggle, 'uncheck').mockImplementation(() => {}),
  type: jest.spyOn(Type, 'ifExists').mockImplementation(() => {}),
};

describe('Form module test', () => {
  describe('fillOut', () => {
    it('should return resolved', async () => {
      await Form.fillOut([{}]);
      expect(mock.fillOutField).toHaveBeenCalledTimes(1);
      expect(mock.fillOutField).toHaveBeenNthCalledWith(1, expect.any(Object), {}, {});
      expect(mock.getValue).not.toHaveBeenCalled();
    });

    it('should return rejected', async () => {
      await Form.fillOut().catch((ex) => expect(ex.message)
        .toEqual('Form config should be an array.'));
      expect(mock.fillOutField).not.toHaveBeenCalled();
      expect(mock.getValue).not.toHaveBeenCalled();
    });
  });

  describe('fillOutiField', () => {
    it('should checked the field', async () => {
      const config = {
        label: 'label',
        selector: 'selector',
        type: 'check',
      };
      const context = {};
      const data = { key: 'value' };
      await Form.__test__.fillOutField(context, config, data);
      expect(mock.click).not.toHaveBeenCalled();
      expect(mock.getValue).not.toHaveBeenCalled();
      expect(mock.toggleCheck).toHaveBeenCalledTimes(1);
      expect(mock.toggleCheck).toHaveBeenNthCalledWith(1, 'selector', 'label');
      expect(mock.toggleDeselect).not.toHaveBeenCalled();
      expect(mock.toggleSelect).not.toHaveBeenCalled();
      expect(mock.toggleUncheck).not.toHaveBeenCalled();
      expect(mock.type).not.toHaveBeenCalled();
    });

    it('should clicked on the field', async () => {
      const config = {
        label: 'label',
        selector: 'selector',
        timeout: 100,
        type: 'click',
      };
      const context = {};
      const data = { key: 'value' };
      await Form.__test__.fillOutField(context, config, data);
      expect(mock.click).toHaveBeenCalledTimes(1);
      expect(mock.click).toHaveBeenNthCalledWith(1, 'selector', 'label', 100);
      expect(mock.getValue).not.toHaveBeenCalled();
      expect(mock.toggleCheck).not.toHaveBeenCalled();
      expect(mock.toggleDeselect).not.toHaveBeenCalled();
      expect(mock.toggleSelect).not.toHaveBeenCalled();
      expect(mock.toggleUncheck).not.toHaveBeenCalled();
      expect(mock.type).not.toHaveBeenCalled();
    });

    it('should deselected values from the field', async () => {
      const config = {
        defaultValue: 'default',
        label: 'label',
        selector: 'selector',
        type: 'deselect-text',
        value: 'key',
      };
      const context = {};
      const data = { key: 'value' };
      await Form.__test__.fillOutField(context, config, data);
      expect(mock.click).not.toHaveBeenCalled();
      expect(mock.getValue).toHaveBeenCalledTimes(1);
      expect(mock.getValue).toHaveBeenNthCalledWith(1, data, 'key', 'default');
      expect(mock.toggleCheck).not.toHaveBeenCalled();
      expect(mock.toggleDeselect).toHaveBeenCalledTimes(1);
      expect(mock.toggleDeselect).toHaveBeenNthCalledWith(1, 'selector', 'value', 'label');
      expect(mock.toggleSelect).not.toHaveBeenCalled();
      expect(mock.toggleUncheck).not.toHaveBeenCalled();
      expect(mock.type).not.toHaveBeenCalled();
    });

    it('should selected values from the field', async () => {
      const config = {
        defaultValue: 'default',
        label: 'label',
        selector: 'selector',
        type: 'select-text',
        value: 'key',
      };
      const context = {};
      const data = { key: 'value' };
      await Form.__test__.fillOutField(context, config, data);
      expect(mock.click).not.toHaveBeenCalled();
      expect(mock.getValue).toHaveBeenCalledTimes(1);
      expect(mock.getValue).toHaveBeenNthCalledWith(1, data, 'key', 'default');
      expect(mock.toggleCheck).not.toHaveBeenCalled();
      expect(mock.toggleDeselect).not.toHaveBeenCalled();
      expect(mock.toggleSelect).toHaveBeenCalledTimes(1);
      expect(mock.toggleSelect).toHaveBeenNthCalledWith(1, 'selector', 'value', 'label');
      expect(mock.toggleUncheck).not.toHaveBeenCalled();
      expect(mock.type).not.toHaveBeenCalled();
    });

    it('should typed values to the field', async () => {
      const config = {
        defaultValue: 'default',
        label: 'label',
        selector: 'selector',
        type: 'type',
        value: 'key',
      };
      const context = {};
      const data = { key: 'value' };
      await Form.__test__.fillOutField(context, config, data);
      expect(mock.click).not.toHaveBeenCalled();
      expect(mock.getValue).toHaveBeenCalledTimes(1);
      expect(mock.getValue).toHaveBeenNthCalledWith(1, data, 'key', 'default');
      expect(mock.toggleCheck).not.toHaveBeenCalled();
      expect(mock.toggleDeselect).not.toHaveBeenCalled();
      expect(mock.toggleSelect).not.toHaveBeenCalled();
      expect(mock.toggleUncheck).not.toHaveBeenCalled();
      expect(mock.type).toHaveBeenCalledTimes(1);
      expect(mock.type).toHaveBeenNthCalledWith(1, 'selector', 'value', 'label');
    });

    it('should unchecked the field', async () => {
      const config = {
        label: 'label',
        selector: 'selector',
        type: 'uncheck',
      };
      const context = {};
      const data = { key: 'value' };
      await Form.__test__.fillOutField(context, config, data);
      expect(mock.click).not.toHaveBeenCalled();
      expect(mock.getValue).not.toHaveBeenCalled();
      expect(mock.toggleCheck).not.toHaveBeenCalled();
      expect(mock.toggleDeselect).not.toHaveBeenCalled();
      expect(mock.toggleSelect).not.toHaveBeenCalled();
      expect(mock.toggleUncheck).toHaveBeenCalledTimes(1);
      expect(mock.toggleUncheck).toHaveBeenNthCalledWith(1, 'selector', 'label');
      expect(mock.type).not.toHaveBeenCalled();
    });

    it('should use default value', async () => {
      const config = {
        type: 'no-op',
      };
      const context = {};
      await Form.__test__.fillOutField(context, config);
      expect(mock.click).not.toHaveBeenCalled();
      expect(mock.getValue).not.toHaveBeenCalled();
      expect(mock.toggleCheck).not.toHaveBeenCalled();
      expect(mock.toggleDeselect).not.toHaveBeenCalled();
      expect(mock.toggleSelect).not.toHaveBeenCalled();
      expect(mock.toggleUncheck).not.toHaveBeenCalled();
      expect(mock.type).not.toHaveBeenCalled();
    });
  });

  describe('getValue', () => {
    it('should return expected', () => {
      let actual = Form.__test__.getValue({ nested: { key: 'value' } }, 'nested.key');
      expect(actual).toEqual('value');
      actual = Form.__test__.getValue({ nested: { key: 0 } }, 'nested.key');
      expect(actual).toEqual(0);
      actual = Form.__test__.getValue({ nested: { key: false } }, 'nested.key');
      expect(actual).toEqual(false);
      actual = Form.__test__.getValue({ nested: { key: '' } }, 'nested.key');
      expect(actual).toEqual('');
    });

    it('should return default value', () => {
      let actual = Form.__test__.getValue({ nested: { key: 'value' } }, 'nested.keyx', 'default');
      expect(actual).toEqual('default');
      actual = Form.__test__.getValue({ nested: { key: null } }, 'nested.key', 'default');
      expect(actual).toEqual('default');
    });
  });
});
