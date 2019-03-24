function mergeConfig(config, updated) {
  return Object.assign({}, config, updated, {
    headers: Object.assign({}, config.headers, updated.headers || {}),
    responseTransformers: [].concat(updated.responseTransformers || config.responseTransformers),
    polyfills: Object.assign({}, config.polyfills, updated.polyfills || {})
  });
}

function keys(object) {
  var keys = [];
  for (var key in object) {
    keys.push(key);
  }
  return keys;
}

function toQueryString(data, URLSearchParams) {
  var URLSearchParamsImplementation = URLSearchParams || window.URLSearchParams;
  var params = new URLSearchParamsImplementation();
  for (var key of keys(data).sort()) {
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

function ImmutableAjaxRequest(config) {
  this._config = config;
  this.jsonResponseTransformer = jsonResponseTransformer;
}

ImmutableAjaxRequest.prototype.method = function method(method) {
  method = method.toUpperCase();
  if (['GET', 'POST'].indexOf(method) === -1) {
    throw new Error('Invalid method: ' + method);
  }
  return new ImmutableAjaxRequest(mergeConfig(this._config, { method }));
};

ImmutableAjaxRequest.prototype.get = function get(url) {
  return this.method('get').url(url);
};

ImmutableAjaxRequest.prototype.post = function post(url) {
  return this.method('post').url(url);
};

ImmutableAjaxRequest.prototype.url = function url(url) {
  var segments = url.split('?');
  var url = segments[0];
  var query = segments[1] || '';
  return new ImmutableAjaxRequest(mergeConfig(this._config, { url, query }));
};

ImmutableAjaxRequest.prototype.baseUrl = function baseUrl(baseUrl) {
  if (baseUrl === null) {
    baseUrl = '';
  }
  return new ImmutableAjaxRequest(mergeConfig(this._config, { baseUrl }));
};

ImmutableAjaxRequest.prototype.query = function query(query) {
  if (typeof query !== 'string') {
    query = toQueryString(query, this._config.polyfills.URLSearchParams);
  }
  return new ImmutableAjaxRequest(mergeConfig(this._config, { query }));
};

ImmutableAjaxRequest.prototype.headers = function headers(object) {
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
  return new ImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.amendHeaders = function amendHeaders(object) {
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
  return new ImmutableAjaxRequest(mergeConfig(this._config, { headers }));
};

ImmutableAjaxRequest.prototype.body = function body(data) {
  if (typeof data === 'number') {
    data = data.toString();
  } else if (typeof data !== 'string') {
    throw new Error('Unexpected type for request body');
  }
  return new ImmutableAjaxRequest(mergeConfig(this._config, { body: data }));
};

ImmutableAjaxRequest.prototype.urlencoded = function urlencoded(data) {
  return this.header('content-type', 'application/x-www-form-urlencoded').body(toQueryString(data, this._config.polyfills.URLSearchParams));
};

ImmutableAjaxRequest.prototype.json = function json(data) {
  return this.header('content-type', 'application/json').body(JSON.stringify(data));
};

ImmutableAjaxRequest.prototype.header = function header(name, value) {
  var config = mergeConfig(this._config, {});
  config.headers[name.toLowerCase()] = value;
  return new ImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.unsetHeader = function unsetHeader(name) {
  var config = mergeConfig(this._config, {});
  name = name.toLowerCase();
  if (typeof config.headers[name] !== 'undefined') {
    delete config.headers[name];
  }
  return new ImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.timeout = function timeout(milliseconds) {
  if (milliseconds === null || milliseconds === 0) {
    milliseconds = null;
  } else if (typeof milliseconds !== 'number') {
    throw new Error('Expected a number for timeout');
  }
  return new ImmutableAjaxRequest(mergeConfig(this._config, { timeout: milliseconds }));
};

ImmutableAjaxRequest.prototype.unsetTimeout = function unsetTimeout() {
  return new ImmutableAjaxRequest(mergeConfig(this._config, { timeout: null }));
};

ImmutableAjaxRequest.prototype.setResponseTransformers = function setResponseTransformers(transformers) {
  if (!Array.isArray(transformers)) {
    throw new Error('Expected an array of response transformers');
  }
  for (var i in transformers) {
    if (typeof transformers[i] !== 'function') {
      throw new Error('One or more response transformer is not a function');
    }
  }
  return new ImmutableAjaxRequest(mergeConfig(this._config, { responseTransformers: transformers }));
};

ImmutableAjaxRequest.prototype.setAllowedStatusCode = function setAllowedStatusCode(allowedStatusCode) {
  if (typeof allowedStatusCode !== 'number' && !(allowedStatusCode instanceof RegExp) && typeof allowedStatusCode !== 'function') {
    throw new Error('Expected a number, a regex or a function in setAllowedStatusCode');
  }
  return new ImmutableAjaxRequest(mergeConfig(this._config, { allowedStatusCode }));
};

ImmutableAjaxRequest.prototype.polyfills = function polyfills(polyfills) {
  var config = mergeConfig(this._config, { polyfills });
  if (polyfills === null) {
    config.polyfills = {};
  }
  return new ImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.toObject = function toObject(name) {
  return mergeConfig(this._config, {});
};

ImmutableAjaxRequest.prototype.config = function config(name) {
  return this.toObject();
};

ImmutableAjaxRequest.prototype.debug = function debug(name) {
  return this.toObject();
};

ImmutableAjaxRequest.prototype.send = function send(name) {
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
          for(var item of httpRequest.getAllResponseHeaders().split('\r\n')) {
            if (!item) {
              continue;
            }
            var segments = item.split(': ');
            headers[segments[0]] = segments[1];
          }

          var response = {
            headers,
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
      timeoutId = setTimeout(() => {
        reject(new Error('Request failed due to timeout (' + config.timeout + 'ms)'));
        didTimeout = true;
        httpRequest.abort();
      }, config.timeout);
    }

    if (config.method === 'get') {
      httpRequest.send();
    } else {
      httpRequest.send(config.body);
    }
  });
};

// Export a new instance from which all new requests are to be extended
var baseRequest = new ImmutableAjaxRequest({
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

if (typeof window !== 'undefined') {
  window.request = baseRequest;
} else if (typeof module !== 'undefined') {
  module.exports = baseRequest;
}
