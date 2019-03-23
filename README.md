# supreme-ajax

> Browser AJAX library for those who like immutability.


## Principles

- Immutable API
- Promise-based
- Throws meaningful errors
- Understands Content-Type
  - Decodes JSON responses by default
- Works on modern browsers
  - No external dependencies
  - See [polyfills](#polyfills) for a list of polyfills you might need for older browsers


## Installation

Install via npm or yarn:

```bash
npm install supreme-ajax
# or
yarn add supreme-ajax
```

Import in a project:

```js
import request from 'supreme-ajax';
// or
const request} = require('supreme-ajax');
```


## Usage

See these basic examples or [the full API below](#api).

```js
// Make a GET request
request
  .get('https://example.com')
  .query({ foo: 'bar' })
  .send()
  .then(response => {
    // ...
  })
  .catch(error => {
    // ...
  })

// Make a POST request
request
  .post('https://example.com/accounts')
  .json({ foo: 'bar' })
  .send()

// Make a POST request (urlencoded)
request
  .post('https://example.com/accounts')
  .urlencoded({ foo: 'bar' })
  .send()

// Set a base URL
request
  .baseUrl('https://example.com')
  .get('/accounts')
  .send()

// Catch errors
request
  .get('https://example.com')
  .query({ foo: 'bar' })
  .send()
  .catch(error => {
    console.error(error.response.status);
  })

// Set headers
request
  .get('https://example.com')
  .headers({
    'X-Random': 1
  })
  .send()

// Set a timeout
request
  .get('https://example.com')
  .timeout(2000)
  .send()

// JSON is decoded automatically based on Content-Type header of the response (can be turned off)
request
  .get('https://example.com/accounts.json')
  .send()
  .then(response => {
    console.log(response.data);
  })

// Bring your own Promise
request
  .polyfills({ Promise: require('bluebird') })
  .get('https://example.com')
  .send()
```


## Extending

Each method of `ImmutableAjaxRequest` returns a new instance of `ImmutableAjaxRequest`. This is demonstrated in the example below.

The example uses [`toObject`](#toobject) which returns a copy of all configuration of that specific instance at that moment in time.

```js
const req1 = request
  .get('https://example.com')
  .query({ foo: 'bar' });

// Extend from previous request
const req2 = req1.query({ something: 'different' });

console.log(req2 === req1); // => false
console.log(req1.toObject().query); // => { foo: 'bar' }
console.log(req2.toObject().query); // => { something: 'different' }
```

Practical example of how to create a base request with some defaults and later utilize it for requests:

```js
const api = request
  .baseUrl('https://example.com/api/v1')
  .headers({
    'X-API-KEY': 'secret123'
  });

// All these requests will have the base URL and headers set above
api.get('/accounts').send();
api.post('/accounts').body(data).send();
```


## Inspect request config

Use the API methods `toObject`, `config` or `debug` to inspect the configuration of an `ImmutableAjaxRequest` instance.

```js
const req = request.get('https://example.com');
console.log(req.toObject().url);
```

See [`toObject`](#toobject).


## API

The following methods are available.

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

Forward-slashes are normalized automatically:

```js
// All of these will result in URL 'https://example.com/accounts'
request.baseUrl('https://example.com').url('accounts')
request.baseUrl('https://example.com/').url('accounts')
request.baseUrl('https://example.com').url('/accounts')
request.baseUrl('https://example.com/').url('/accounts')
```

### query

Sets query parameters from an object. Overwrites existing query.

```js
.query(object)
```

Where `object` is key-value object of query parameters to set. Will be encoded using `URLSearchParams#toString`.

### headers

Sets request headers from an object. Overwrites existing headers.

```js
.headers(object)
```

Where `object` is key-value object of headers to set.

Example:

```js
const req = request.headers({ first: 'example' }).headers({ second: 'example' });
console.log(req.toObject().headers) // => { second: 'example' }
```

### amendHeaders

Sets request headers from an object. Only overwrites headers present in the given object.

```js
.amendHeaders(object)
```

Where `object` is key-value object of headers to set.

Example:

```js
const req = request.headers({ first: 'example' }).amendHeaders({ second: 'example' });
console.log(req.toObject().headers) // => { first: 'example', second: 'example' }
```

### header

Adds or updates a header value.

```js
.header(key, value)
```

Where `key` is a string and `value` is a string.

Example:

```js
const req = request.headers({ first: 'example' }).header('second', 'example');
console.log(req.toObject().headers) // => { first: 'example', second: 'example' }
```

### unsetHeader

Removes a header from the request.

```js
.unsetHeader(name)
```

Where `name` is a string.

Example:

```js
const req = request.headers({ first: 'example', second: 'example' }).unsetHeader('first');
console.log(req.toObject().headers) // => { second: 'example' }
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
.send()
```

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

A new `Promise` is always returned, and the `ImmutableAjaxRequest` is not mutated, so you can send the same request multiple times.

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
  Promise: window.Promise,
  URLSearchParams: window.URLSearchParams
})
```

Links to polyfills for older browsers if you need to support them (these automatically patch `window.Promise` and `window.URLSearchParams`; no need to use `request.polyfills`):

- [es6-promise](https://github.com/stefanpenner/es6-promise)
- [url-search-params](https://github.com/WebReflection/url-search-params)

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
//     'X-Random': 'foo'
//   },
//   allowedStatusCode: /^2[0-9]{2}$/,
//   timeout: null,
//   responseTransformers: [
//     req.jsonResponseTransformer
//   ],
// }
```


## Tests

Run all tests:

```bash
yarn test
```

Start test server and open mocha-tests in your browser for live development.

```bash
yarn live-test
```
