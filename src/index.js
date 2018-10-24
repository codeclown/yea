var allowedMethods = ['GET', 'POST'];

function merge(base, object) {
  return _.merge({}, base, object);
}

function jsonResponseTransformer(response) {
  if (response.headers['content-type'] && response.headers['content-type'].indexOf('application/json') === 0) {
    return merge(response, {
      data: JSON.parse(response.body)
    });
  }
  return response;
}

function ImmutableAjaxRequest(config) {
  this.config = config;
}

ImmutableAjaxRequest.prototype.method = function method(method) {
  method = method.toUpperCase();
  if (allowedMethods.indexOf(method) === -1) {
    throw new Error('Invalid method: ' + method)
  }
  return new ImmutableAjaxRequest(merge(this.config, { method }));
};

ImmutableAjaxRequest.prototype.url = function url(url) {
  return new ImmutableAjaxRequest(merge(this.config, { url }));
};

ImmutableAjaxRequest.prototype.headers = function headers(object) {
  var headers = {};
  for (var name in object) {
    name = name.toLowerCase();
    var value = object[name];
    if (typeof value === 'string') {
      headers[name] = value;
    } else if (typeof value === 'number') {
      headers[name] = value.toString();
    } else {
      throw new Error('Invalid header value for header \'' + name + '\'');
    }
  }
  var config = merge(this.config, {});
  config.headers = headers;
  return new ImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.body = function body(data) {
  if (typeof data !== 'string') {
    throw new Error;
  }
  return new ImmutableAjaxRequest(merge(this.config, { body: data }));
};

ImmutableAjaxRequest.prototype.urlencoded = function urlencoded(data) {
  var params = new URLSearchParams();
  for (var key in data) {
    params.append(key, data[key]);
  }
  return this.header('content-type', 'application/x-www-form-urlencoded').body(params.toString());
};

ImmutableAjaxRequest.prototype.json = function json(data) {
  return this.header('content-type', 'application/json').body(JSON.stringify(data));
};

ImmutableAjaxRequest.prototype.header = function header(name, value) {
  var config = merge(this.config, {});
  config.headers[name.toLowerCase()] = value;
  return new ImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.unsetHeader = function unsetHeader(name) {
  var config = merge(this.config, {});
  if (typeof config.headers[name] !== 'undefined') {
    delete config.headers[name];
  }
  return createImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.timeout = function timeout(milliseconds) {
  if (typeof milliseconds !== 'number') {
    throw new Error;
  }
  return new ImmutableAjaxRequest(merge(this.config, { timeout: milliseconds }));
};

ImmutableAjaxRequest.prototype.unsetTimeout = function unsetTimeout(milliseconds) {
  var config = merge(this.config, {});
  config.timeout = null;
  return new ImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.setResponseTransformers = function setResponseTransformers(transformers) {
  var config = merge(this.config, {});
  config.responseTransformers = transformers.concat();
  return new ImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.setAllowedStatusCode = function setAllowedStatusCode(allowedStatusCode) {
  if (typeof allowedStatusCode !== 'number' && !(allowedStatusCode instanceof RegExp) && typeof allowedStatusCode !== 'function') {
    throw new Error;
  }
  var config = merge(this.config, { allowedStatusCode });
  return new ImmutableAjaxRequest(config);
};

ImmutableAjaxRequest.prototype.toObject = function toObject(name) {
  return merge(this.config, {});
};

ImmutableAjaxRequest.prototype.send = function send(name) {
  var config = this.config;
  var timeoutId;
  var didTimeout = false;

  return new Promise(function sendPromise(resolve, reject) {
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

    httpRequest.open(config.method, config.url, true);

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
if (window) {
  window.request = new ImmutableAjaxRequest({
    method: 'GET',
    url: '',
    headers: {},
    allowedStatusCode: /^2[0-9]{2}$/,
    timeout: null,
    responseTransformers: [
      jsonResponseTransformer
    ]
  });
}
