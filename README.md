[![Version](https://img.shields.io/npm/v/puppeteer-extra-plugin-angular.svg)](http://bit.ly/32X27uf)
[![Downloads](https://img.shields.io/npm/dt/puppeteer-extra-plugin-angular.svg)](http://bit.ly/32X27uf)
[![Dependency Status](https://img.shields.io/david/rickypc/puppeteer-extra-plugin-angular.svg)](http://bit.ly/2SM3Ygy)
[![Dev Dependency Status](https://img.shields.io/david/dev/rickypc/puppeteer-extra-plugin-angular.svg)](http://bit.ly/30ZDj2P)
[![Code Style](https://img.shields.io/badge/code%20style-Airbnb-red.svg)](http://bit.ly/2JYN1gk)
[![Build](https://img.shields.io/travis/rickypc/puppeteer-extra-plugin-angular.svg)](http://bit.ly/2YuZRuH)
[![Coverage](https://img.shields.io/codecov/c/github/rickypc/puppeteer-extra-plugin-angular.svg)](http://bit.ly/2Kb1F2Y)
[![License](https://img.shields.io/npm/l/puppeteer-extra-plugin-angular.svg)](http://bit.ly/2yi7gyO)

Puppeteer Extra Plugin Angular
==============================

A plugin for [puppeteer-extra](http://bit.ly/2JYg8Aa) to provide [puppeteer](http://bit.ly/2JX4gOZ) functionality with [Angular](http://bit.ly/2Yw8Mw6) synchronization support.

Installation
-

```bash
$ npm install --save puppeteer-extra-plugin-angular
```

API Reference
-
Provide puppeteer functionality with Angular synchronization support.

**Extends**: <code>external:PuppeteerExtraPlugin</code>  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | Options |

**Example**  
```js
const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-angular')());

(async () => {
  const configs = [
    {
      label: 'Email',
      selector: 'input.email',
      type: 'type',
      value: 'theEmail'
    },
    {
      label: 'Subscribe',
      selector: 'input.subscribe',
      type: 'check',
    },
    {
      label: 'Send',
      selector: 'button',
      type: 'click',
    },
  ];
  const data = {
    theEmail: 'you@address.com',
  };

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Calling page.waitUntilActionReady internally.
  await page.navigateUntilReady('https://angular.io');
  await page.formFillOut(configs, data);

  // Calling page.waitUntilActionReady internally.
  await page.clickIfExists('a.link', 'A Link');

  await page.toggleUncheck('input.radio[value="1"]', 'Uncheck Radio');
  await page.toggleSelectByText('select1', 'Option 1', 'Selection');
  await page.toggleDeselectByText('select2', 'Option 2', 'Deselection');
  await page.toggleCheck('input.check', 'Checkbox');

  // Wait until both document.readyState is interactive or complete
  // and Angular is ready.
  await page.waitUntilActionReady();

  await page.typeIfExists('input.text', 'Something', 'Textfield');

  // Wait until Angular is ready.
  await page.waitUntilAngularReady();

  await page.close();
  await browser.close();
})();
```

* [puppeteer-extra-plugin-angular](#module_puppeteer-extra-plugin-angular) ⇐ <code>external:PuppeteerExtraPlugin</code>
    * _static_
        * [.Click](#module_puppeteer-extra-plugin-angular.Click)
            * [.ifExists(selector, [label], [timeout])](#module_puppeteer-extra-plugin-angular.Click.ifExists) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.Form](#module_puppeteer-extra-plugin-angular.Form)
            * [.fillOut(configs, [data])](#module_puppeteer-extra-plugin-angular.Form.fillOut) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.Navigate](#module_puppeteer-extra-plugin-angular.Navigate)
            * [.untilReady(url, [timeout])](#module_puppeteer-extra-plugin-angular.Navigate.untilReady) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.PromiseTimeout](#module_puppeteer-extra-plugin-angular.PromiseTimeout)
            * _static_
                * [.untilSettledOrTimedOut(executor, timeoutExecutor, timeout)](#module_puppeteer-extra-plugin-angular.PromiseTimeout.untilSettledOrTimedOut) ⇒ <code>Promise.&lt;\*&gt;</code>
            * _inner_
                * [~Executor](#module_puppeteer-extra-plugin-angular.PromiseTimeout..Executor) : <code>function</code>
                * [~TimeoutExecutor](#module_puppeteer-extra-plugin-angular.PromiseTimeout..TimeoutExecutor) : <code>function</code>
        * [.Toggle](#module_puppeteer-extra-plugin-angular.Toggle)
            * [.check(selector, [label])](#module_puppeteer-extra-plugin-angular.Toggle.check) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.deselectByText(selector, values, [label])](#module_puppeteer-extra-plugin-angular.Toggle.deselectByText) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.selectByText(selector, values, [label])](#module_puppeteer-extra-plugin-angular.Toggle.selectByText) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.uncheck(selector, [label])](#module_puppeteer-extra-plugin-angular.Toggle.uncheck) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.Type](#module_puppeteer-extra-plugin-angular.Type)
            * [.ifExists(selector, value, [label])](#module_puppeteer-extra-plugin-angular.Type.ifExists) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.Wait](#module_puppeteer-extra-plugin-angular.Wait)
            * [.untilActionReady([timeout])](#module_puppeteer-extra-plugin-angular.Wait.untilActionReady) ⇒ <code>Promise.&lt;void&gt;</code>
            * [.untilAngularReady([timeout])](#module_puppeteer-extra-plugin-angular.Wait.untilAngularReady) ⇒ <code>Promise.&lt;void&gt;</code>
    * _inner_
        * [~Logger](#module_puppeteer-extra-plugin-angular.Logger)
            * [.debug(...args)](#module_puppeteer-extra-plugin-angular.Logger+debug) ⇒ <code>null</code>
            * [.debugAndReturn(response, ...args)](#module_puppeteer-extra-plugin-angular.Logger+debugAndReturn) ⇒ <code>\*</code>

<a name="module_puppeteer-extra-plugin-angular.Click"></a>

### puppeteer-extra-plugin-angular.Click
**Kind**: static constant of [<code>puppeteer-extra-plugin-angular</code>](#module_puppeteer-extra-plugin-angular)  
<a name="module_puppeteer-extra-plugin-angular.Click.ifExists"></a>

#### Click.ifExists(selector, [label], [timeout]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Trigger Click event if given selector exists and wait for Angular to be ready.

**Kind**: static method of [<code>Click</code>](#module_puppeteer-extra-plugin-angular.Click)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Truthy if click triggered and Angular is ready, otherwise falsy.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> |  | Selector to match. |
| [label] | <code>string</code> | <code>&quot;click&quot;</code> | Debug label. |
| [timeout] | <code>number</code> | <code>25000</code> | Maximum wait timeout. |

**Example**  
```js
const response = await page.clickIfExists('a[href="/"]', 'Some Link', 5000);
```
<a name="module_puppeteer-extra-plugin-angular.Form"></a>

### puppeteer-extra-plugin-angular.Form
**Kind**: static constant of [<code>puppeteer-extra-plugin-angular</code>](#module_puppeteer-extra-plugin-angular)  
<a name="module_puppeteer-extra-plugin-angular.Form.fillOut"></a>

#### Form.fillOut(configs, [data]) ⇒ <code>Promise.&lt;void&gt;</code>
Fill out the form's field on given configs and data.

**Kind**: static method of [<code>Form</code>](#module_puppeteer-extra-plugin-angular.Form)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise to be resolved once the form filled out.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| configs | <code>Array.&lt;Object&gt;</code> |  | An array of field configs. |
| [configs[].defaultValue] | <code>string</code> | <code>null</code> | Default value. |
| configs[].label | <code>string</code> |  | Debug label. |
| configs[].selector | <code>string</code> |  | Selector to match. |
| configs[].type | <code>check</code> \| <code>click</code> \| <code>deselect-text</code> \| <code>select-text</code> \| <code>type</code> \| <code>uncheck</code> |  | Action type. |
| configs[].value | <code>string</code> |  | JmesPath expression of the given data. |
| [data] | <code>Object</code> | <code>{}</code> | Data to be used to fill out the form. |

**Example**  
```js
const configs = [
  {
    label: 'Name',
    selector: 'input.name',
    type: 'type',
    value: 'theName'
  },
  {
    label: 'Company',
    selector: 'input.company',
    type: 'type',
    value: 'theCompany'
  },
];
const data = {
  theCompany: 'My Company',
  theName: 'My Name',
};
await page.formFillOut(configs, data);
```
<a name="module_puppeteer-extra-plugin-angular.Navigate"></a>

### puppeteer-extra-plugin-angular.Navigate
**Kind**: static constant of [<code>puppeteer-extra-plugin-angular</code>](#module_puppeteer-extra-plugin-angular)  
<a name="module_puppeteer-extra-plugin-angular.Navigate.untilReady"></a>

#### Navigate.untilReady(url, [timeout]) ⇒ <code>Promise.&lt;void&gt;</code>
Navigate to given url and wait for Angular to be ready.

**Kind**: static method of [<code>Navigate</code>](#module_puppeteer-extra-plugin-angular.Navigate)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise to be resolved once the navigation is completed.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | Target URL. |
| [timeout] | <code>number</code> | <code>25000</code> | Maximum wait timeout. |

**Example**  
```js
await page.navigateUntilReady('https://angular.io', 5000);
```
<a name="module_puppeteer-extra-plugin-angular.PromiseTimeout"></a>

### puppeteer-extra-plugin-angular.PromiseTimeout
**Kind**: static constant of [<code>puppeteer-extra-plugin-angular</code>](#module_puppeteer-extra-plugin-angular)  

* [.PromiseTimeout](#module_puppeteer-extra-plugin-angular.PromiseTimeout)
    * _static_
        * [.untilSettledOrTimedOut(executor, timeoutExecutor, timeout)](#module_puppeteer-extra-plugin-angular.PromiseTimeout.untilSettledOrTimedOut) ⇒ <code>Promise.&lt;\*&gt;</code>
    * _inner_
        * [~Executor](#module_puppeteer-extra-plugin-angular.PromiseTimeout..Executor) : <code>function</code>
        * [~TimeoutExecutor](#module_puppeteer-extra-plugin-angular.PromiseTimeout..TimeoutExecutor) : <code>function</code>

<a name="module_puppeteer-extra-plugin-angular.PromiseTimeout.untilSettledOrTimedOut"></a>

#### PromiseTimeout.untilSettledOrTimedOut(executor, timeoutExecutor, timeout) ⇒ <code>Promise.&lt;\*&gt;</code>
Provide timeout procedure on inflight promise.

**Kind**: static method of [<code>PromiseTimeout</code>](#module_puppeteer-extra-plugin-angular.PromiseTimeout)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - Resolve or reject response value.  

| Param | Type | Description |
| --- | --- | --- |
| executor | <code>Executor</code> | Executor function. |
| timeoutExecutor | <code>TimeoutExecutor</code> | Timeout executor function. |
| timeout | <code>number</code> | Maximum wait timeout. |

**Example**  
```js
const response = await PromiseTimeout.untilSettledOrTimedOut((resolve, reject, pending) => {
  // Do something promising here...
  if (pending()) {
    // Do something more promising here...
    resolve(true);
  }
}, (resolve, reject) => {
  reject(Error('error'));
}, 5000);
```
<a name="module_puppeteer-extra-plugin-angular.PromiseTimeout..Executor"></a>

#### PromiseTimeout~Executor : <code>function</code>
Executor function that is executed immediately by the Promise implementation.

**Kind**: inner typedef of [<code>PromiseTimeout</code>](#module_puppeteer-extra-plugin-angular.PromiseTimeout)  

| Param | Type | Description |
| --- | --- | --- |
| resolve | <code>function</code> | Resolve the promise. |
| reject | <code>function</code> | Reject the promise. |
| pending | <code>function</code> | True if Promise is not timed out, otherwise false. |

**Example**  
```js
const executor = (resolve, reject, pending) => {
  // Do something promising here...
  if (pending()) {
    try {
      // Do something more promising here...
      resolve(true);
    } catch (ex) {
      reject(false);
    }
  }
};
```
<a name="module_puppeteer-extra-plugin-angular.PromiseTimeout..TimeoutExecutor"></a>

#### PromiseTimeout~TimeoutExecutor : <code>function</code>
Timeout executor function that is executed when max wait timeout is reached.

**Kind**: inner typedef of [<code>PromiseTimeout</code>](#module_puppeteer-extra-plugin-angular.PromiseTimeout)  

| Param | Type | Description |
| --- | --- | --- |
| resolve | <code>function</code> | Resolve the promise. |
| reject | <code>function</code> | Reject the promise. |

**Example**  
```js
const timeoutExecutor = (resolve, reject) => {
  try {
    resolve(true);
  } catch (ex) {
    reject(false);
  }
};
```
<a name="module_puppeteer-extra-plugin-angular.Toggle"></a>

### puppeteer-extra-plugin-angular.Toggle
**Kind**: static constant of [<code>puppeteer-extra-plugin-angular</code>](#module_puppeteer-extra-plugin-angular)  

* [.Toggle](#module_puppeteer-extra-plugin-angular.Toggle)
    * [.check(selector, [label])](#module_puppeteer-extra-plugin-angular.Toggle.check) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.deselectByText(selector, values, [label])](#module_puppeteer-extra-plugin-angular.Toggle.deselectByText) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.selectByText(selector, values, [label])](#module_puppeteer-extra-plugin-angular.Toggle.selectByText) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.uncheck(selector, [label])](#module_puppeteer-extra-plugin-angular.Toggle.uncheck) ⇒ <code>Promise.&lt;boolean&gt;</code>

<a name="module_puppeteer-extra-plugin-angular.Toggle.check"></a>

#### Toggle.check(selector, [label]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Check the checkbox or radio button field.

**Kind**: static method of [<code>Toggle</code>](#module_puppeteer-extra-plugin-angular.Toggle)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Truthy if the field is checked, otherwise falsy.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> |  | Selector to match. |
| [label] | <code>string</code> | <code>&quot;toggle&quot;</code> | Debug label. |

**Example**  
```js
const response = await page.toggleCheck('input.checkbox', 'Some Checkbox');
```
<a name="module_puppeteer-extra-plugin-angular.Toggle.deselectByText"></a>

#### Toggle.deselectByText(selector, values, [label]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Deselect given values from the select field options.

**Kind**: static method of [<code>Toggle</code>](#module_puppeteer-extra-plugin-angular.Toggle)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Truthy if the given values are deselected, otherwise falsy.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> |  | Selector to match. |
| values | <code>Array</code> |  | A list of value to be deselected from the select field. |
| [label] | <code>string</code> | <code>&quot;toggle&quot;</code> | Debug label. |

**Example**  
```js
const response = await page.toggleDeselectByText('select.by-text',
  'Some Option', 'Some Select');
```
<a name="module_puppeteer-extra-plugin-angular.Toggle.selectByText"></a>

#### Toggle.selectByText(selector, values, [label]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Select given values from the select field options.

**Kind**: static method of [<code>Toggle</code>](#module_puppeteer-extra-plugin-angular.Toggle)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Truthy if the given values are selected, otherwise falsy.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> |  | Selector to match. |
| values | <code>Array</code> |  | A list of value to be selected from the select field. |
| [label] | <code>string</code> | <code>&quot;toggle&quot;</code> | Debug label. |

**Example**  
```js
const response = await page.toggleSelectByText('select.by-text',
  'Some Other Option', 'Some Select');
```
<a name="module_puppeteer-extra-plugin-angular.Toggle.uncheck"></a>

#### Toggle.uncheck(selector, [label]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Uncheck the checkbox or radio button field.

**Kind**: static method of [<code>Toggle</code>](#module_puppeteer-extra-plugin-angular.Toggle)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Truthy if the field is unchecked, otherwise falsy.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> |  | Selector to match. |
| [label] | <code>string</code> | <code>&quot;toggle&quot;</code> | Debug label. |

**Example**  
```js
const response = await page.toggleUncheck('input.checkbox', 'Some Checkbox');
```
<a name="module_puppeteer-extra-plugin-angular.Type"></a>

### puppeteer-extra-plugin-angular.Type
**Kind**: static constant of [<code>puppeteer-extra-plugin-angular</code>](#module_puppeteer-extra-plugin-angular)  
<a name="module_puppeteer-extra-plugin-angular.Type.ifExists"></a>

#### Type.ifExists(selector, value, [label]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Fill out the field on given selector with given value.

**Kind**: static method of [<code>Type</code>](#module_puppeteer-extra-plugin-angular.Type)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Truthy if the field is filled out, otherwise falsy.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> |  | Selector to match. |
| value | <code>string</code> |  | Value to be used to fill out the field. |
| [label] | <code>string</code> | <code>&quot;&#x27;type&#x27;&quot;</code> | Debug label. |

**Example**  
```js
const response = await page.typeIfExists('input.email', 'you@address.com', 'Email');
```
<a name="module_puppeteer-extra-plugin-angular.Wait"></a>

### puppeteer-extra-plugin-angular.Wait
**Kind**: static constant of [<code>puppeteer-extra-plugin-angular</code>](#module_puppeteer-extra-plugin-angular)  

* [.Wait](#module_puppeteer-extra-plugin-angular.Wait)
    * [.untilActionReady([timeout])](#module_puppeteer-extra-plugin-angular.Wait.untilActionReady) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.untilAngularReady([timeout])](#module_puppeteer-extra-plugin-angular.Wait.untilAngularReady) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_puppeteer-extra-plugin-angular.Wait.untilActionReady"></a>

#### Wait.untilActionReady([timeout]) ⇒ <code>Promise.&lt;void&gt;</code>
Wait until both page and Angular is ready.

**Kind**: static method of [<code>Wait</code>](#module_puppeteer-extra-plugin-angular.Wait)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise to be resolved once the wait is completed.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [timeout] | <code>number</code> | <code>25000</code> | Maximum wait timeout. |

**Example**  
```js
await page.waitUntilActionReady(5000);
```
<a name="module_puppeteer-extra-plugin-angular.Wait.untilAngularReady"></a>

#### Wait.untilAngularReady([timeout]) ⇒ <code>Promise.&lt;void&gt;</code>
Wait until Angular is ready.

**Kind**: static method of [<code>Wait</code>](#module_puppeteer-extra-plugin-angular.Wait)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise to be resolved once the wait is completed.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [timeout] | <code>number</code> | <code>25000</code> | Maximum wait timeout. |

**Example**  
```js
await page.waitUntilAngularReady(5000);
```
<a name="module_puppeteer-extra-plugin-angular.Logger"></a>

### puppeteer-extra-plugin-angular~Logger
**Kind**: inner class of [<code>puppeteer-extra-plugin-angular</code>](#module_puppeteer-extra-plugin-angular)  

* [~Logger](#module_puppeteer-extra-plugin-angular.Logger)
    * [.debug(...args)](#module_puppeteer-extra-plugin-angular.Logger+debug) ⇒ <code>null</code>
    * [.debugAndReturn(response, ...args)](#module_puppeteer-extra-plugin-angular.Logger+debugAndReturn) ⇒ <code>\*</code>

<a name="module_puppeteer-extra-plugin-angular.Logger+debug"></a>

#### logger.debug(...args) ⇒ <code>null</code>
Process debug information if it is not negligible messages.

**Kind**: instance method of [<code>Logger</code>](#module_puppeteer-extra-plugin-angular.Logger)  
**Returns**: <code>null</code> - Null value.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Debug arguments. |

**Example**  
```js
const logger = new Logger('module:namespace');
const response = await logger.debug('debug message %s', Error('error'));
```
<a name="module_puppeteer-extra-plugin-angular.Logger+debugAndReturn"></a>

#### logger.debugAndReturn(response, ...args) ⇒ <code>\*</code>
Process debug information if it is not negligible messagesi and return response value.

**Kind**: instance method of [<code>Logger</code>](#module_puppeteer-extra-plugin-angular.Logger)  
**Returns**: <code>\*</code> - Given response value.  

| Param | Type | Description |
| --- | --- | --- |
| response | <code>\*</code> | Response value. |
| ...args | <code>\*</code> | Debug arguments. |

**Example**  
```js
const logger = new Logger('module:namespace');
const response = await logger.debugAndReturn(true, 'debug message %s', Error('error'));
```

Development Dependencies
-
You will need to install [Node.js](http://bit.ly/2SMCGXK) as a local development dependency. The `npm` package manager comes bundled with all recent releases of `Node.js`.

`npm install` will attempt to resolve any `npm` module dependencies that have been declared in the project’s `package.json` file, installing them into the `node_modules` folder.

```bash
$ npm install
```

Run Linter
-
To make sure we followed code style best practice, run:

```bash
$ npm run lint
```

Run Unit Tests
-
To make sure we did not break anything, let's run:

```bash
$ npm test
```

Contributing
-
If you would like to contribute code to Puppeteer Extra Plugin Angular project you can do so through GitHub by forking the repository and sending a pull request.

When submitting code, please make every effort to follow existing conventions and style in order to keep the code as readable as possible. Please also include appropriate test cases.

Before your code can be accepted into the project you must also sign the [Puppeteer Extra Plugin Angular CLA](http://bit.ly/2Y8t4w9) (Individual Contributor License Agreement).

That's it! Thank you for your contribution!

License
-
Copyright (c) 2018 - 2019 Richard Huang.

This plugin is free software, licensed under: [GNU Affero General Public License (AGPL-3.0)](http://bit.ly/2yi7gyO).

Documentation and other similar content are provided under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://bit.ly/2SMCRlS).
