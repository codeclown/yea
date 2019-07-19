/**
 * supreme-ajax
 *
 * @license MIT
 * @author Martti Laine <martti@marttilaine.com>
 * @link https://github.com/codeclown/supreme-ajax
 */
(function (factory) {
  if(typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory();
  } else if(typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    window['supremeAjax'] = factory();
  }
})(function () {
  function mergeConfig(config, updated) {
    return Object.assign({}, config, updated, {
      headers: Object.assign({}, config.headers, updated.headers || {}),
      responseTransformers: [].concat(updated.responseTransformers || config.responseTransformers),
      polyfills: Object.assign({}, config.polyfills, updated.polyfills || {})
    });
  }

  function toQueryString(data, URLSearchParams) {
    var URLSearchParamsImplementation = URLSearchParams || window.URLSearchParams;
    var params = new URLSearchParamsImplementation();
    for (var key in data) {
      var value = data[key];
      if (Array.isArray(value)) {
        for (var i in value) {
          params.append(key, value[i]);
        }
      } else {
        params.append(key, data[key]);
      }
    }
    return params.toString();
  }

  function jsonResponseTransformer(response) {
    if (response.headers['content-type'] && response.headers['content-type'].indexOf('application/json') === 0) {
      response.data = JSON.parse(response.body);
    }
    return response;
  }

  function SupremeAjaxRequest(config) {
    this._config = config;
    this.jsonResponseTransformer = jsonResponseTransformer;
  }

  SupremeAjaxRequest.prototype.method = function method(method) {
    method = method.toUpperCase();
    if (['GET', 'POST'].indexOf(method) === -1) {
      throw new Error('Invalid method: ' + method);
    }
    return new SupremeAjaxRequest(mergeConfig(this._config, { method: method }));
  };

  SupremeAjaxRequest.prototype.get = function get(url) {
    return this.method('get').url(url);
  };

  SupremeAjaxRequest.prototype.post = function post(url) {
    return this.method('post').url(url);
  };

  SupremeAjaxRequest.prototype.url = function url(fullUrl) {
    var segments = fullUrl.split('?');
    var url = segments[0];
    var query = segments[1] || '';
    return new SupremeAjaxRequest(mergeConfig(this._config, { url: url, query: query }));
  };

  SupremeAjaxRequest.prototype.baseUrl = function baseUrl(baseUrl) {
    if (baseUrl === null) {
      baseUrl = '';
    }
    return new SupremeAjaxRequest(mergeConfig(this._config, { baseUrl: baseUrl }));
  };

  SupremeAjaxRequest.prototype.query = function query(query) {
    if (typeof query !== 'string') {
      query = toQueryString(query, this._config.polyfills.URLSearchParams);
    }
    return new SupremeAjaxRequest(mergeConfig(this._config, { query: query }));
  };

  SupremeAjaxRequest.prototype.headers = function headers(object) {
    var headers = {};
    for (var name in object) {
      var value = object[name];
      name = name.toLowerCase();
      if (typeof value === 'string') {
        headers[name] = value;
      } else if (typeof value === 'number') {
        headers[name] = value.toString();
      } else {
        throw new Error('Invalid header value for header \'' + name + '\'');
      }
    }
    var config = mergeConfig(this._config, {});
    config.headers = headers;
    return new SupremeAjaxRequest(config);
  };

  SupremeAjaxRequest.prototype.amendHeaders = function amendHeaders(object) {
    var headers = Object.assign({}, this._config.headers);
    for (var name in object) {
      var value = object[name];
      name = name.toLowerCase();
      if (typeof value === 'string') {
        headers[name] = value;
      } else if (typeof value === 'number') {
        headers[name] = value.toString();
      } else {
        throw new Error('Invalid header value for header \'' + name + '\'');
      }
    }
    return new SupremeAjaxRequest(mergeConfig(this._config, { headers: headers }));
  };

  SupremeAjaxRequest.prototype.body = function body(data) {
    if (typeof data === 'number') {
      data = data.toString();
    } else if (typeof data !== 'string') {
      throw new Error('Unexpected type for request body');
    }
    return new SupremeAjaxRequest(mergeConfig(this._config, { body: data }));
  };

  SupremeAjaxRequest.prototype.urlencoded = function urlencoded(data) {
    return this.header('content-type', 'application/x-www-form-urlencoded').body(toQueryString(data, this._config.polyfills.URLSearchParams));
  };

  SupremeAjaxRequest.prototype.json = function json(data) {
    return this.header('content-type', 'application/json').body(JSON.stringify(data));
  };

  SupremeAjaxRequest.prototype.header = function header(name, value) {
    var config = mergeConfig(this._config, {});
    config.headers[name.toLowerCase()] = value;
    return new SupremeAjaxRequest(config);
  };

  SupremeAjaxRequest.prototype.unsetHeader = function unsetHeader(name) {
    var config = mergeConfig(this._config, {});
    name = name.toLowerCase();
    if (typeof config.headers[name] !== 'undefined') {
      delete config.headers[name];
    }
    return new SupremeAjaxRequest(config);
  };

  SupremeAjaxRequest.prototype.timeout = function timeout(milliseconds) {
    if (milliseconds === null || milliseconds === 0) {
      milliseconds = null;
    } else if (typeof milliseconds !== 'number') {
      throw new Error('Expected a number for timeout');
    }
    return new SupremeAjaxRequest(mergeConfig(this._config, { timeout: milliseconds }));
  };

  SupremeAjaxRequest.prototype.unsetTimeout = function unsetTimeout() {
    return new SupremeAjaxRequest(mergeConfig(this._config, { timeout: null }));
  };

  SupremeAjaxRequest.prototype.setResponseTransformers = function setResponseTransformers(transformers) {
    if (!Array.isArray(transformers)) {
      throw new Error('Expected an array of response transformers');
    }
    for (var i in transformers) {
      if (typeof transformers[i] !== 'function') {
        throw new Error('One or more response transformer is not a function');
      }
    }
    return new SupremeAjaxRequest(mergeConfig(this._config, { responseTransformers: transformers }));
  };

  SupremeAjaxRequest.prototype.setAllowedStatusCode = function setAllowedStatusCode(allowedStatusCode) {
    if (typeof allowedStatusCode !== 'number' && !(allowedStatusCode instanceof RegExp) && typeof allowedStatusCode !== 'function') {
      throw new Error('Expected a number, a regex or a function in setAllowedStatusCode');
    }
    return new SupremeAjaxRequest(mergeConfig(this._config, { allowedStatusCode: allowedStatusCode }));
  };

  SupremeAjaxRequest.prototype.polyfills = function polyfills(polyfills) {
    var config = mergeConfig(this._config, { polyfills: polyfills });
    if (polyfills === null) {
      config.polyfills = {};
    }
    return new SupremeAjaxRequest(config);
  };

  SupremeAjaxRequest.prototype.toObject = function toObject() {
    return mergeConfig(this._config, {});
  };

  SupremeAjaxRequest.prototype.config = function config() {
    return this.toObject();
  };

  SupremeAjaxRequest.prototype.debug = function debug() {
    return this.toObject();
  };

  SupremeAjaxRequest.prototype.sendUrlencoded = function sendUrlencoded(data) {
    return this.urlencoded(data).send();
  };

  SupremeAjaxRequest.prototype.sendJson = function sendJson(data) {
    return this.json(data).send();
  };

  SupremeAjaxRequest.prototype.send = function send(body) {
    var config = this._config;
    var timeoutId;
    var didTimeout = false;
    var PromiseImplementation = config.polyfills.Promise || window.Promise;

    return new PromiseImplementation(function sendPromise(resolve, reject) {
      var httpRequest = new XMLHttpRequest();

      httpRequest.onreadystatechange = function onreadystatechange() {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE && !didTimeout) {
            var headers = {};
            var items = httpRequest.getAllResponseHeaders().split('\r\n');
            for (var i = 0; i < items.length; i++) {
              if (!items[i]) {
                continue;
              }
              var segments = items[i].split(': ');
              // TODO: missing test, search for 'lowercases incoming response header names'
              var key = segments[0].toLowerCase();
              headers[key] = segments[1];
            }

            var response = {
              headers: headers,
              status: httpRequest.status,
              body: httpRequest.responseText
            };

            var isValid;
            if (typeof config.allowedStatusCode === 'number') {
              isValid = response.status === config.allowedStatusCode;
            } else if (config.allowedStatusCode instanceof RegExp) {
              isValid = config.allowedStatusCode.test(response.status);
            } else if (typeof config.allowedStatusCode === 'function') {
              isValid = config.allowedStatusCode(response.status);
            }

            if (isValid) {
              var transformers = config.responseTransformers.concat();
              var transformer;
              // eslint-disable-next-line no-cond-assign
              while (transformer = transformers.shift()) {
                response = transformer(response);
              }

              if (timeoutId) {
                clearTimeout(timeoutId);
              }
              resolve(response);
            } else {
              var error = new Error('Request failed with status ' + response.status);
              error.response = response;
              reject(error);
            }
          }
        } catch (exception) {
          reject(exception);
        }
      };

      var url = new URL(config.url, config.baseUrl || window.location).href;
      if (config.query) {
        url += '?' + config.query;
      }
      httpRequest.open(config.method, url, true);

      for (var name in config.headers) {
        httpRequest.setRequestHeader(name, config.headers[name]);
      }

      if (config.timeout !== null) {
        timeoutId = setTimeout(function () {
          reject(new Error('Request failed due to timeout (' + config.timeout + 'ms)'));
          didTimeout = true;
          httpRequest.abort();
        }, config.timeout);
      }

      if (config.method === 'get') {
        httpRequest.send();
      } else {
        httpRequest.send(typeof body !== 'undefined' ? body : config.body);
      }
    });
  };

  // Export a new instance from which all new requests are to be extended
  var baseRequest = new SupremeAjaxRequest({
    method: 'GET',
    baseUrl: '',
    url: '',
    body: '',
    headers: {},
    allowedStatusCode: /^2[0-9]{2}$/,
    timeout: null,
    responseTransformers: [
      jsonResponseTransformer
    ],
    polyfills: {}
  });

  return baseRequest;
});
