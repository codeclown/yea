# API

The following methods are available.

- [`.get(url)`](#get) [`.post(url)`](#post) [`.put(url)`](#put) [`.delete(url)`](#delete) [`.method(method)`](#method)
- [`.url(url)`](#url) [`.urlParams(object)`](#urlparams) [`.baseUrl(url)`](#baseurl) [`.query(object | string)`](#query)
- [`.headers(object)`](#headers) [`.amendHeaders(object)`](#amendheaders) [`.header(key, value)`](#header) [`.unsetHeader(name)`](#unsetheader)
- [`.body(data)`](#body) [`.json(value)`](#json) [`.urlencoded(value)`](#urlencoded)
- [`.timeout(milliseconds)`](#timeout) [`.unsetTimeout()`](#unsettimeout)
- [`.prop(path)`](#prop)
- [`.send([body])`](#send) [`.sendUrlencoded(data)`](#sendurlencoded) [`.sendJson(data)`](#sendjson) [`.then()`](#then)
- [`.setResponseTransformers([])`](#setresponsetransformers) [`.setAllowedStatusCode(allowed)`](#setallowedstatuscode) [`.polyfills(polyfills)`](#polyfills)
- [`.toObject()` / `.config()` / `.debug()`](#toobject)

## get

```js
.get(url)
```

Where `url` is a string. Shorthand for `request.method('get').url(url)`.

## post

```js
.post(url)
```

Where `url` is a string. Shorthand for `request.method('post').url(url)`.

## put

```js
.put(url)
```

Where `url` is a string. Shorthand for `request.method('put').url(url)`.

## delete

```js
.delete(url)
```

Where `url` is a string. Shorthand for `request.method('delete').url(url)`.

## method

Sets the HTTP method.

```js
.method(method)
```

Where `method` is a string, e.g. `'get'` or `'GET'`.

## url

Sets the full URL of the request. If a query-string is present, it will override any previously set query parameters.

```js
.url(url)
```

Where `url` is a string, e.g. `'https://example.com/accounts'`.

## urlParams

Sets URL parameters which will be replaced from the URL when the request is sent.

```js
.urlParams(object)
```

Where `object` is an object.

Example:

```js
// Will make request to "/api/accounts/123/info"
request.get('/api/accounts/:accountId/info').urlParams({ accountId: 123 })
```

## baseUrl

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

## query

Sets query parameters from an object or a string. Overwrites existing query.

```js
.query(object | string)
```

Where `object` is key-value object of query parameters to set, or a valid query string.

Example:

```js
request.query({ first: 'foo', second: 'bar' })
request.query('first=foo&second=bar')
```

## headers

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

## amendHeaders

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

## header

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

## unsetHeader

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

## body

Set the raw body of the request.

```js
.body(data)
```

Where `data` is a string.

See also [`json`](#json) and [`urlencoded`](#urlencoded).

## json

Sets a JSON-encoded body and sets the `Content-Type` header to `'application/json'`.

```js
.json(value)
```

Where `value` is mixed.

Shorthand for `request.header('Content-Type', 'application/json').body(JSON.stringify(value))`.

## urlencoded

Sets a URL-encoded body and sets the `Content-Type` header to `'application/urlencoded'`.

```js
.urlencoded(data)
```

Where `value` is an object.

Shorthand for `request.header('content-type', 'application/x-www-form-urlencoded').body(_valueUrlEncoded_)`.

## timeout

Sets a timeout after which the request will be aborted and the Promise rejected.

```js
.timeout(milliseconds)
```

Where `milliseconds` is an integer.

See also [`unsetTimeout`](#unsetTimeout).

## unsetTimeout

Removes the timeout-value previously set with [`timeout`](#timeout).

```js
.unsetTimeout()
```

## prop

Sets a path (similar to [`lodash.get`](https://lodash.com/docs/4.17.15#get)) which will be resolved once the response is returned.

```js
.prop(path)
```

Where `path` is a string or an array.

Example:

```js
const account = await request.get('...').prop('data.accounts[0]');
const contentType = await request.get('...').prop(['headers', 'content-type']);
```

## send

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

## sendUrlencoded

Shorthand for `.urlencoded(data).send()`.

```js
.sendUrlencoded(data)
```

## sendJson

Shorthand for `.json(data).send()`.

```js
.sendJson(data)
```

## setResponseTransformers

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

## setAllowedStatusCode

By default any 2XX status code resolves the Promise and other status codes will reject it. This can be customized using `setAllowedStatusCode`.

```js
.setAllowedStatusCode(allowed)
```

Where `allowed` is an integer, a `RegExp` or a function.

## polyfills

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

## then

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

## toObject

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
