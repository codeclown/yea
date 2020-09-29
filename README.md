# yea

[![Build Status](https://travis-ci.org/codeclown/yea.svg?branch=master)](https://travis-ci.org/codeclown/yea) [![NPM](https://img.shields.io/badge/npm-yea-blue)](https://www.npmjs.com/package/yea) [![GitHub](https://img.shields.io/badge/github-codeclown%2Fyea-blue)](https://github.com/codeclown/yea)

> Yea... an immutable-style AJAX library for the browser.

Requests are configured via method calls and each method always returns a fresh request instance, with no references to past instances.


## Principles

- Immutable API, Promise-based, throws meaningful errors
- No external dependencies, quite small (<2.4KB minified and gzipped)
- Understands Content-Type (decodes JSON responses by default)
- TypeScript support
- Bring your own Promise-implementation
- [Works on modern browsers and some older ones](#browser-support)
- [Fully tested](/test/specs) (see e.g. [requests.spec.js](/test/specs/requests.spec.js)) in real browsers, thanks to Sauce Labs

Why not use fetch, axios, jQuery, etc..? See [COMPARISON.md](COMPARISON.md).


## Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Usage with TypeScript](#usage-with-typescript)
- [Extending (instances)](#extending-instances)
- [API](#api)
- [Development](#development)
- [Browser support](#browser-support)
- [Changelog](#changelog)
- [License](#license)


## Installation

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/yea@1.5.0/build/yea.min.js"></script>
<script>
  yea.get('https://reqres.in/api/users').then(response => {
    console.log(response.status);
    console.log(response.body); // string (original JSON)
    console.log(response.data); // object
  });
</script>
```

[View example in JSFiddle](https://jsfiddle.net/6kryoe90/)

### Via npm

Install via [npm](https://www.npmjs.com/package/yea) or yarn:

```bash
npm install yea
# or
yarn add yea
```

Import in a project:

```js
import request from 'yea';
// or
const request = require('yea');
```


## Usage

See these basic examples or [the full API below](#api).

```js
// Make a GET request
request
  .baseUrl('https://example.com/api')
  .headers({
    'X-API-KEY': 'secret123'
  })
  .get('/accounts/:accountId/info')
  .urlParams({ accountId: 123 })
  .query({ foo: 'bar' })
  .timeout(2000)
  .then(response => {
    console.log(response.status);
    console.log(response.body);
  })
  .catch(error => {
    if (error.response) {
      console.error(error.response.status);
    } else {
      // ...
    }
  })

// POST requests
request.post('https://example.com/accounts').body('raw data')
request.post('https://example.com/accounts').json({ foo: 'bar' })
request.post('https://example.com/accounts').urlencoded({ foo: 'bar' })

// Helper method to return a nested value from the request
// JSON response is decoded automatically based on Content-Type (configurable)
const account = await request.get('/accounts.json').prop('data.accounts[0]')
```


### Usage with TypeScript

Yea comes with built-in type declarations. See [`index.d.ts`](index.d.ts).


## Extending (instances)

Each method of `YeaAjaxRequest` returns a new instance of `YeaAjaxRequest`. This is demonstrated in the example below.

The example uses [`toObject`](#toobject) which returns a copy of all configuration of that specific instance at that moment in time.

```js
const req1 = request
  .get('https://example.com')
  .query({ foo: 'bar' });

// Extend from previous request
const req2 = req1.query({ something: 'different' });

console.log(req2 === req1); // => false
console.log(req1.toObject().query); // => 'foo=bar'
console.log(req2.toObject().query); // => 'something=different'
```

### Example

Practical example of how to create a base request with some defaults and later utilize it for requests:

```js
// API-specific defaults for all requests
const api = request
  .baseUrl('https://example.com/api/v1')
  .headers({
    'X-API-KEY': 'secret123'
  });

// Extend to endpoints
const accountEndpoint = api.url('/accounts/:accountId');
const invoiceEndpoint = api.url('/invoices/:invoiceId');

// Usage
const { data } = await accountEndpoint.urlParams({ accountId: 123 });
await invoiceEndpoint.method('post').urlParams({ invoiceId: 9000 }).sendJson({ ... });
```


## API

The following methods are available.

- [`.get(url)`](API.md#get) [`.post(url)`](API.md#post) [`.put(url)`](API.md#put) [`.delete(url)`](API.md#delete) [`.method(method)`](API.md#method)
- [`.url(url)`](API.md#url) [`.urlParams(object)`](API.md#urlparams) [`.baseUrl(url)`](API.md#baseurl) [`.query(object | string)`](API.md#query)
- [`.headers(object)`](API.md#headers) [`.amendHeaders(object)`](API.md#amendheaders) [`.header(key, value)`](API.md#header) [`.unsetHeader(name)`](API.md#unsetheader)
- [`.body(data)`](API.md#body) [`.json(value)`](API.md#json) [`.urlencoded(value)`](API.md#urlencoded)
- [`.timeout(milliseconds)`](API.md#timeout) [`.unsetTimeout()`](API.md#unsettimeout)
- [`.prop(path)`](API.md#prop)
- [`.send([body])`](API.md#send) [`.sendUrlencoded(data)`](API.md#sendurlencoded) [`.sendJson(data)`](API.md#sendjson) [`.then()`](API.md#then)
- [`.setResponseTransformers([])`](API.md#setresponsetransformers) [`.setAllowedStatusCode(allowed)`](API.md#setallowedstatuscode) [`.polyfills(polyfills)`](API.md#polyfills)
- [`.toObject()` / `.config()` / `.debug()`](API.md#toobject)

See [API.md](API.md).


## Development

### Tests

For local development, run `yarn dev`. It starts a web server with a Mocha UI and watches for changes. You can view the UI in the browser at [http://localhost:9876](http://localhost:9876).

```bash
$ yarn dev
Test server is running!
Open http://localhost:9876/ in your browser
```

For a one-time full test suite execution, run `yarn test`. It runs all tests in a suite of browsers (powered by Karma).

```bash
yarn test
```

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).


## Browser support

Chrome, Firefox, IE 10+, Edge, Safari 11+

Cross-browser Testing Platform Provided by [Sauce Labs](https://saucelabs.com).


## Changelog

See [CHANGELOG.md](CHANGELOG.md).


## License

MIT
