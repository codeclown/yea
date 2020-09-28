export as namespace yea;

export interface YeaResponse {
  headers: {
    [key: string]: string;
  };
  body: string;
  status: number;
}

/**
 * Error thrown when sending a request fails.
 */
export interface YeaRequestError extends Error {
  response: YeaResponse;
}

export type ResponseTransformer = (response: YeaResponse) => YeaResponse;

declare class YeaAjaxRequest implements PromiseLike<YeaResponse> {
  jsonResponseTransformer: ResponseTransformer;

  then<TResult1 = YeaResponse, TResult2 = never>(
    onfulfilled?:
      | ((value: YeaResponse) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2>;

  /**
   * Sets the HTTP method.
   * @see get
   * @see post
   * @see put
   * @see delete
   */
  method(
    method:
      | "GET"
      | "POST"
      | "PUT"
      | "DELETE"
      | "get"
      | "post"
      | "put"
      | "delete"
  ): this;

  /**
   * Initializes a GET request
   * @example `yea.get('http://example.com/data.json')`
   */
  get(url: string): this;

  /**
   * Initializes a POST request
   * @example `yea.post('http://example.com/data')`
   */
  post(url: string): this;

  /**
   * Initializes a PUT request
   */
  put(url: string): this;

  /**
   * Initializes a DELETE request
   */
  delete(url: string): this;

  /**
   * Sets the full URL of the request. If a query-string is present, it will override any previously set query parameters.
   */
  url(url: string): this;

  /**
   * Sets URL parameters which will be replaced from the URL when the request is sent.
   */
  urlParams(urlParams: object): this;

  /**
   * Sets the base URL to which all subsequent request URLs will be appended.
   */
  baseUrl(baseUrl: string): this;

  /**
   * Sets query parameters from an object. Overwrites existing query.
   */
  query(query: object | string): this;

  /**
   * Sets request headers from an object. Overwrites existing headers.
   */
  headers(headers: object): this;

  /**
   * Sets request headers from an object. Only overwrites headers present in the given object.
   */
  amendHeaders(headers: object): this;

  /**
   * Adds or updates a header value.
   */
  header(name: string, value: string): this;

  /**
   * Removes a header from the request.
   */
  unsetHeader(name: string): this;

  /**
   * Set the raw body of the request. See also `json` and `urlencoded`.
   */
  body(data: string | number): this;

  /**
   * Sets a URL-encoded body and sets the `Content-Type` header to `'application/urlencoded'`.
   */
  urlencoded(data: object): this;

  /**
   * Sets a JSON-encoded body and sets the `Content-Type` header to `'application/json'`.
   */
  json(data: any): this;

  /**
   * Sets a timeout after which the request will be aborted and the Promise rejected.
   */
  timeout(milliseconds): this;

  /**
   * Removes the timeout-value previously set with `timeout`.
   */
  unsetTimeout(): this;

  /**
   * Sets a path (similar to `lodash.get`) which will be resolved once the response is returned.
   * @example
```js
const account = await request.get('...').prop('data.accounts[0]');
const contentType = await request.get('...').prop(['headers', 'content-type']);
```
   */
  prop(path: string): this;

  /**
   * Sets a list of response transformers which are called when a response is received. See the documentation for more information.
   */
  setResponseTransformers(transformers: ResponseTransformer[]): this;

  /**
   * By default any 2XX status code resolves the Promise and other status codes will reject it. This can be customized using `setAllowedStatusCode`.
   */
  setAllowedStatusCode(
    allowedStatusCode: number | RegExp | ((statusCode: number) => boolean)
  ): this;

  /**
   * Override global dependencies which are used internally (like Promise). See the documentation for more information.
   */
  polyfills(polyfills: { Promise: typeof Promise }): this;

  /**
   * Returns the request configuration as an object.
   */
  toObject(): object;
  config(): object;
  debug(): object;

  /**
   * Shorthand for `.urlencoded(data).send()`.
   */
  sendUrlencoded(data: object): Promise<YeaResponse>;

  /**
   * Shorthand for `.json(data).send()`.
   */
  sendJson(data: any): Promise<YeaResponse>;

  /**
   * Dispatches the request and returns a Promise. See also `sendJson` and `sendUrlencoded`.
   */
  send(body?: string): Promise<YeaResponse>;
}

// An instance of a class is exported
// i.e. `module.exports = new YeaAjaxRequest()`
declare const _YeaAjaxRequest: YeaAjaxRequest;
export default _YeaAjaxRequest;
