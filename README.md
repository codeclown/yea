# yea

[![Build Status](https://travis-ci.org/codeclown/yea.svg?branch=master)](https://travis-ci.org/codeclown/yea) [![NPM](https://img.shields.io/badge/npm-yea-blue)](https://www.npmjs.com/package/yea) [![GitHub](https://img.shields.io/badge/github-codeclown%2Fyea-yellowgreen)](https://github.com/codeclown/yea)

> Yea... an immutable-style AJAX library for the browser.

Requests are configured via method calls and each method always returns a fresh request instance, with no references to past instances.


## Principles

- Immutable API, Promise-based, throws meaningful errors
- No external dependencies, quite small (<2.4KB minified and gzipped)
- Understands Content-Type (decodes JSON responses by default)
- [Works on modern browsers and some older ones](#browser-support)
- [Fully tested](/test/specs) (see e.g. [requests.spec.js](/test/specs/requests.spec.js))

Why not use fetch, axios, jQuery, etc..? See [COMPARISON.md](COMPARISON.md).


## Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Inspect request config](#inspect-request-config)
- [Extending (instances)](#extending-instances)
- [Development](#development)
- [Browser support](#browser-support)
- [Changelog](#changelog)
- [License](#license)


## Installation

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/yea@1.1.0/build/yea.min.js"></script>
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
  .get('https://example.com')
  .query({ foo: 'bar' })
  .then(response => {
    console.log(response.body);
  })
  .catch(error => {
    console.error(error.response.status);
  })

// Make a POST request
request
  .post('https://example.com/accounts')
  .body('raw data')

// Make a POST request (json)
request
  .post('https://example.com/accounts')
  .json({ foo: 'bar' })

// Make a POST request (urlencoded)
request
  .post('https://example.com/accounts')
  .urlencoded({ foo: 'bar' })

// Set a base URL
request
  .baseUrl('https://example.com')
  .get('/accounts')

// Set headers
request
  .get('https://example.com')
  .headers({
    'X-Random': 1
  })
  .header('x-another', 'test')
  .unsetHeader('x-another')

// Set a timeout
request
  .get('https://example.com')
  .timeout(2000)

// JSON responses decoded automatically based on Content-Type header (can be turned off)
request
  .get('https://example.com/accounts.json')
  .then(response => {
    console.log(response.data);
  })

// Bring your own Promise
request
  .polyfills({ Promise: require('bluebird') })
  .get('https://example.com')

// You can use async/await of course
const { status, body } = await request.get('http://example.com')
```


## API

The following methods are available.

- [.get(url)](#get)
- [.post(url)](#post)
- [.method(method)](#method)
- [.url(url)](#url)
- [.baseUrl(url)](#baseurl)
- [.query(object | string)](#query)
- [.headers(object)](#headers)
- [.amendHeaders(object)](#amendheaders)
- [.header(key, value)](#header)
- [.unsetHeader(name)](#unsetheader)
- [.body(data)](#body)
- [.json(value)](#json)
- [.urlencoded(value)](#urlencoded)
- [.timeout(milliseconds)](#timeout)
- [.unsetTimeout()](#unsettimeout)
- [.send([body])](#send)
- [.sendUrlencoded(data)](#sendurlencoded)
- [.sendJson(data)](#sendjson)
- [.setResponseTransformers([])](#setresponsetransformers)
- [.setAllowedStatusCode(allowed)](#setallowedstatuscode)
- [.polyfills(polyfills)](#polyfills)
- [.then()](#then)
- [.toObject() / .config() / .debug()](#toobject)

### get

```js
.get(url)
```

Where `url` is a string. Shorthand for `request.method('get').url(url)`.

### post

```js
.post(url)
```

Where `url` is a string. Shorthand for `request.method('post').url(url)`.

### method

Sets the HTTP method.

```js
.method(method)
```

Where `method` is a string, e.g. `'get'` or `'GET'`.

### url

Sets the full URL of the request. If a query-string is present, it will override any previously set query parameters.

```js
.url(url)
```

Where `url` is a string, e.g. `'https://example.com/accounts'`.

### baseUrl

Sets the base URL to which all subsequent request URLs will be appended.

```js
.baseUrl(url)
```

Where `url` is a string, e.g. `'https://example.com'`.

A few examples of practical usage:

```js
request.baseUrl('https://example.com').url('accounts')    // => https://example.com/accounts
request.baseUrl('https://example.com').url('/accounts')   // => https://example.com/accounts
request.baseUrl('https://example.com/nested').url('/accounts')     // => https://example.com/nested/accounts
request.baseUrl('https://example.com/nested/foo').url('accounts')  // => https://example.com/nested/foo/accounts
```

### query

Sets query parameters from an object. Overwrites existing query.

```js
.query(object | string)
```

Where `object` is key-value object of query parameters to set, or a valid query string.

### headers

Sets request headers from an object. Overwrites existing headers.

```js
.headers(object)
```

Where `object` is key-value object of headers to set.

Example:

```js
const req = request.headers({ 'x-example': 'foo' });
console.log(req.toObject().headers) // => { 'x-example': 'foo' }
// Overwrites all previous headers:
const req2 = req.headers({ 'x-token': 'secret123' });
console.log(req2.toObject().headers) // => { 'x-token': 'secret123' }
```

### amendHeaders

Sets request headers from an object. Only overwrites headers present in the given object.

```js
.amendHeaders(object)
```

Where `object` is key-value object of headers to set.

Example:

```js
const req = request.headers({ 'x-example': 'foo' }).amendHeaders({ 'x-token': 'secret123' });
console.log(req.toObject().headers) // => { 'x-example': 'foo', 'x-token': 'secret123' }
```

### header

Adds or updates a header value.

```js
.header(key, value)
```

Where `key` is a string and `value` is a string.

Example:

```js
const req = request.header('x-example', 'foo').header('x-token', 'secret123');
console.log(req.toObject().headers) // => { 'x-example': 'foo', 'x-token': 'secret123' }
```

### unsetHeader

Removes a header from the request.

```js
.unsetHeader(name)
```

Where `name` is a string.

Example:

```js
const req = request.headers({ 'x-example': 'foo', 'x-token': 'secret123' }).unsetHeader('x-example');
console.log(req.toObject().headers) // => { 'x-token': 'secret123' }
```

### body

Set the body of the request.

```js
.body(data)
```

Where `data` is a string.

See also [`json`](#json) and [`urlencoded`](#urlencoded).

### json

Sets a JSON-encoded body and sets the `Content-Type` header to `'application/json'`.

```js
.json(value)
```

Where `value` is mixed.

Shorthand for `request.header('Content-Type', 'application/json').body(JSON.stringify(value))`.

### urlencoded

Sets a JSON-encoded body and sets the `Content-Type` header to `'application/urlencoded'`.

```js
.urlencoded(value)
```

Where `value` is mixed.

Shorthand for `request.header('content-type', 'application/x-www-form-urlencoded').body(_valueUrlEncoded_)`.

### timeout

Sets a timeout after which the request will be aborted and the Promise rejected.

```js
.timeout(milliseconds)
```

Where `milliseconds` is an integer.

See also [`unsetTimeout`](#unsetTimeout).

### unsetTimeout

Removes the timeout-value previously set with [`timeout`](#timeout).

```js
.unsetTimeout()
```

### send

Dispatches the request and returns a `Promise`.

```js
.send([body])
```

Where the optional argument `body` is a string. If it is set, it will be set as the request body. Also see [`sendJson`](#sendjson) and [`sendUrlencoded`](#sendurlencoded).

The Promise resolves with a `response` object.

```js
request
  .get('https://example.com')
  .then(response => {
    console.log(response.headers); // object
    console.log(response.body); // string
    console.log(response.status); // integer
  })
  .catch(error => {
    console.log(error.message);
    console.log(error.response); // Similar structure as successful response
  })
```

A new `Promise` is always returned, and the `YeaAjaxRequest` is not mutated, so you can send the same request multiple times.

```js
const req = request.get('https://example.com');
req.send().then(response => {
  console.log('first response', response);
});
req.send().then(() => {
  console.log('second response', response);
});
```

See [`polyfills`](#polyfills) for switching away from global `Promise` (e.g. bluebird).

Note that calling `.send()` is not always necessary. You can usually directly call [`.then()`](#then).

### sendUrlencoded

Short-hand for `.urlencoded(data).send()`.

```js
.sendUrlencoded(data)
```

### sendJson

Short-hand for `.json(data).send()`.

```js
.sendJson(data)
```

### setResponseTransformers

Sets a list of response transformers which are called when a response is received. By default the list contains one transformer which decodes JSON bodies based on the response `Content-Type` header.

Using this method you can remove the default transformer:

```js
.setResponseTransformers([])
```

If you need to add it back, just set it again:

```js
request.setResponseTransformers([ request.jsonResponseTransformer ]);
```

Transformer functions are executed sequentially in the order they are in the list, and they receive `response` as the only parameter. Whatever value they return is passed onto the next transformer and eventually back to the Promise-chain.

```js
request.setResponseTransformers([
  response => {
    response.foobar = 'some extra information from elsewhere, for example';
    return response;
  }
]);
```

Reference to the original array is lost:

```js
const array = [];
const req = request.setResponseTransformers(array);
array.push(someFunction);
req.toObject().responseTransformers; // not affected by the push, still []
```

### setAllowedStatusCode

By default any 2XX status code resolves the Promise and other status codes will reject it. This can be customized using `setAllowedStatusCode`.

```js
.setAllowedStatusCode(allowed)
```

Where `allowed` is an integer, a `RegExp` or a function.

### polyfills

Override global dependencies which are used internally. Most useful for adding polyfills or a custom Promise-implementation.

```js
.polyfills(polyfills)
```

Where `polyfills` is an object. See example for the possible dependencies you can override:

```js
request.polyfills({
  Promise: window.Promise
})
```

Links to polyfills for older browsers if you need to support them (these can automatically patch `window.Promise`; no need to use `request.polyfills`):

- [es6-promise](https://github.com/stefanpenner/es6-promise)

### then

Sends the request and resolves like a normal Promise.

```js
.then(arguments)
```

Where arguments are what you would submit to a then-handler of a Promise.

The following examples are basically equivalent:

```js
const responseHandler = response => { /* ... */ };

// using .then()
yea.get('http://example.com').then(responseHandler)

// using .send()
yea.get('http://example.com').send().then(responseHandler)
```

### toObject

Returns the request configuration as an object.

```js
.toObject()
.config() // alias
.debug() // alias
```

Example:

```js
const req = request.baseUrl('http://example.com').get('/info').header('X-Random', 'foo')
const config = req.toObject(); // or req.config() or req.debug()
// =>
// {
//   method: 'GET',
//   url: 'http://example.com/info',
//   body: '',
//   headers: {
//     'x-random': 'foo'
//   },
//   allowedStatusCode: /^2[0-9]{2}$/,
//   timeout: null,
//   responseTransformers: [
//     req.jsonResponseTransformer
//   ],
// }
```


## Inspect request config

Use the API methods [`toObject`, `config` or `debug`](#toobject) to inspect the configuration of an `YeaAjaxRequest` instance.

```js
const req = request.get('https://example.com');
console.log(req.toObject().url);
```


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

Practical example of how to create a base request with some defaults and later utilize it for requests:

```js
const api = request
  .baseUrl('https://example.com/api/v1')
  .headers({
    'X-API-KEY': 'secret123'
  });

// The following requests will use the base URL and headers set above
api.get('/accounts').send();
api.post('/accounts').body(data).send();
```


## Development

### Tests

For local development, run `yarn dev`. It starts a web server and watches for changes. You can view the tests in the browser at [http://localhost:9876](http://localhost:9876).

```bash
$ yarn dev
Test server is running!
Open http://localhost:9876/ in your browser
```

For a one-time full test suite execution, run `yarn test`. It runs all tests in a suite of browsers (powered by Karma).

```bash
yarn test
```


## Browser support

Chrome, Firefox, IE 10+, Edge, Safari 11+

Cross-browser Testing Platform Provided by [Sauce Labs](https://saucelabs.com).


## Changelog

See [CHANGELOG.md](CHANGELOG.md).


## License

MIT
