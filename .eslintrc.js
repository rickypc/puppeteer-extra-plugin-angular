/*!
 *  .eslintrc.js - ESLint configuration.
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

module.exports = {
  env: {
    'jest/globals': true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
  ],
  globals: {
    angular: true,
    document: true,
    window: true,
  },
  plugins: [
    'import',
    'jest',
  ],
  rules: {
    'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['el', 'page'], props: true }],
    'no-underscore-dangle': [2, { allow: ['__test__', '_targetId'] }],
    'space-before-function-paren': ['error', 'always'],
  },
}
