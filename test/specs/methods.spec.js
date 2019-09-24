describe('Methods', function () {
  describe('defaults', function () {
    it('has defaults', function () {
      var defaults = yea.toObject();
      expect(defaults).to.have.keys(['method', 'baseUrl', 'url', 'query', 'body', 'headers', 'responseTransformers', 'allowedStatusCode', 'timeout', 'polyfills']);
      expect(defaults.method).to.equal('GET');
      expect(defaults.baseUrl).to.equal('');
      expect(defaults.url).to.equal('');
      expect(defaults.query).to.equal('');
      expect(defaults.body).to.equal('');
      expect(defaults.headers).to.deep.equal({});
      expect(defaults.responseTransformers).to.deep.equal([yea.jsonResponseTransformer]);
      expect(defaults.allowedStatusCode).to.deep.equal(/^2[0-9]{2}$/);
      expect(defaults.timeout).to.equal(null);
      expect(defaults.polyfills).to.deep.equal({});
    });
  });

  describe('constructor', function () {
    it('throws if used as a function', function () {
      expect(function () {
        yea();
      }).to.throw(/^(yea is not a function|Function expected|yea is not a function. \(In 'yea\(\)', 'yea' is an instance of YeaAjaxRequest\))$/);
    });

    it('throws if used as a constructor', function () {
      expect(function () {
        new yea();
      }).to.throw(/^(yea is not a constructor|Object doesn't support this action|YeaAjaxRequest is not a constructor \(evaluating 'new yea\(\)'\))$/);
    });
  });

  describe('.get', function () {
    it('sets method and URL', function () {
      expect(yea.get('http://example.com/foo').toObject().method).to.equal('GET');
      expect(yea.get('http://example.com/foo').toObject().url).to.equal('http://example.com/foo');
    });

    it('is immutable', function () {
      var req = yea.get('http://example.com/foo');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.post', function () {
    it('sets method and URL', function () {
      expect(yea.post('http://example.com/foo').toObject().method).to.equal('POST');
      expect(yea.post('http://example.com/foo').toObject().url).to.equal('http://example.com/foo');
    });

    it('is immutable', function () {
      var req = yea.post('http://example.com/foo');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.method', function () {
    it('sets method', function () {
      expect(yea.method('GET').toObject().method).to.equal('GET');
    });

    it('is case-insensitive', function () {
      expect(yea.method('get').toObject().method).to.equal('GET');
      expect(yea.method('gEt').toObject().method).to.equal('GET');
    });

    it('is immutable', function () {
      var req = yea.method('get');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.url', function () {
    it('sets url', function () {
      expect(yea.url('http://example.com').toObject().url).to.equal('http://example.com');
    });

    it('sets query', function () {
      expect(yea.url('http://example.com?hello=yes').toObject().url).to.equal('http://example.com');
      expect(yea.url('http://example.com?hello=yes').toObject().query).to.equal('hello=yes');
    });

    it('unsets previous query', function () {
      expect(yea.url('http://example.com?hello=yes').url('http://example.com/foo').toObject().query).to.equal('');
    });

    it('is immutable', function () {
      var req = yea.url('http://example.com');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.baseUrl', function () {
    it('sets baseUrl', function () {
      expect(yea.baseUrl('http://example.com').toObject().baseUrl).to.equal('http://example.com');
    });

    it('allows unsetting baseUrl', function () {
      expect(yea.baseUrl('').toObject().baseUrl).to.equal('');
      expect(yea.baseUrl(null).toObject().baseUrl).to.equal('');
    });

    it('is immutable', function () {
      var req = yea.baseUrl('http://example.com');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.query', function () {
    it('sets query from a string', function () {
      expect(yea.query('foo=bar&example=xyz').toObject().query).to.equal('foo=bar&example=xyz');
    });

    it('sets query from an object', function () {
      expect(yea.query({ foo: 'bar', example: 'xyz' }).toObject().query).to.equal('foo=bar&example=xyz');
      expect(yea.query({ example: 'xyz', foo: 'bar' }).toObject().query).to.equal('example=xyz&foo=bar');
    });

    it('overwrites previous query', function () {
      expect(yea.query({ foo: 'bar', example: 'xyz' }).query({ new: 'query' }).toObject().query).to.equal('new=query');
    });

    it('is immutable', function () {
      var req = yea.query('foo=bar&example=xyz');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.headers', function () {
    it('sets headers', function () {
      expect(yea.headers({ super: 'yes' }).toObject().headers).to.deep.equal({ super: 'yes' });
    });

    it('overwrites existing headers', function () {
      var req = yea.headers({ super: 'yes', foo: 'sir' });
      expect(req.headers({ foo: 'bar', fresh: 'sure' }).toObject().headers).to.deep.equal({ foo: 'bar', fresh: 'sure' });
    });

    it('leaves no references', function () {
      var headers = { super: 'yes' };
      var req = yea.headers(headers);
      expect(req.toObject().headers).to.not.equal(headers);
      headers.super = 'modified';
      expect(req.toObject().headers.super).to.equal('yes');
    });

    it('converts values to string', function () {
      expect(yea.headers({ super: 123 }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('considers keys lowercase', function () {
      expect(yea.headers({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('throws on unexpected types', function () {
      expect(function () {
        yea.headers({ super: {} });
      }).to.throw('Invalid header value for header \'super\'');

      expect(function () {
        yea.headers({ super: [] });
      }).to.throw('Invalid header value for header \'super\'');

      expect(function () {
        yea.headers({ super: function () {} });
      }).to.throw('Invalid header value for header \'super\'');
    });

    it('is immutable', function () {
      var req = yea.headers({ super: 123 });
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.amendHeaders', function () {
    it('sets headers even if there are none', function () {
      expect(yea.amendHeaders({ super: 'yes' }).toObject().headers).to.deep.equal({ super: 'yes' });
    });

    it('overwrites existing values for keys present in the object', function () {
      var req = yea.headers({ super: 'yes', foo: 'sir' });
      expect(req.amendHeaders({ foo: 'bar', fresh: 'sure' }).toObject().headers).to.deep.equal({ super: 'yes', foo: 'bar', fresh: 'sure' });
    });

    it('leaves no references', function () {
      var headers = { super: 'yes' };
      expect(yea.amendHeaders(headers).toObject().headers).to.not.equal(headers);
    });

    it('converts values to string', function () {
      expect(yea.amendHeaders({ super: 123 }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('considers keys lowercase', function () {
      expect(yea.amendHeaders({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
      expect(yea.headers({ super: 'foo' }).amendHeaders({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('throws on unexpected types', function () {
      expect(function () {
        yea.amendHeaders({ super: {} });
      }).to.throw('Invalid header value for header \'super\'');

      expect(function () {
        yea.amendHeaders({ super: [] });
      }).to.throw('Invalid header value for header \'super\'');

      expect(function () {
        yea.amendHeaders({ super: function () {} });
      }).to.throw('Invalid header value for header \'super\'');
    });

    it('is immutable', function () {
      var req = yea.amendHeaders({ super: 123 });
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.unsetHeader', function () {
    it('accepts non-existent header', function () {
      expect(yea.headers({}).unsetHeader('foo').toObject().headers).to.deep.equal({});
      expect(yea.headers({ bar: 'one' }).unsetHeader('foo').toObject().headers).to.deep.equal({ bar: 'one' });
    });

    it('unsets header', function () {
      expect(yea.headers({ foo: 'bar', fresh: 'sure' }).unsetHeader('foo').toObject().headers).to.deep.equal({ fresh: 'sure' });
    });

    it('considers keys lowercase', function () {
      expect(yea.headers({ super: 'foo' }).unsetHeader('SUPER').toObject().headers).to.deep.equal({});
    });

    it('is immutable', function () {
      var req = yea.unsetHeader('foo');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.body', function () {
    it('sets body', function () {
      expect(yea.body('holla').toObject().body).to.equal('holla');
    });

    it('converts values to string', function () {
      expect(yea.body(123).toObject().body).to.equal('123');
    });

    it('throws on unexpected types', function () {
      expect(function () {
        yea.body({});
      }).to.throw('Unexpected type for request body');

      expect(function () {
        yea.body([]);
      }).to.throw('Unexpected type for request body');

      expect(function () {
        yea.body(function () {});
      }).to.throw('Unexpected type for request body');
    });

    it('is immutable', function () {
      var req = yea.body('holla');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.json', function () {
    it('sets request body to encoded JSON', function () {
      expect(yea.json('holla').toObject().body).to.equal('"holla"');
      expect(yea.json(null).toObject().body).to.equal('null');
      expect(yea.json([]).toObject().body).to.equal('[]');
      expect(yea.json({ hey: 'hi' }).toObject().body).to.equal('{"hey":"hi"}');
    });

    it('sets content-type header to application/json', function () {
      expect(yea.json('holla').toObject().headers['content-type']).to.equal('application/json');
    });

    it('is immutable', function () {
      var req = yea.json('holla');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.urlencoded', function () {
    it('sets request body to urlencoded data', function () {
      expect(yea.urlencoded({ hey: 'hi' }).toObject().body).to.equal('hey=hi');
    });

    it('sets content-type header to application/x-www-form-urlencoded', function () {
      expect(yea.urlencoded('holla').toObject().headers['content-type']).to.equal('application/x-www-form-urlencoded');
    });

    it('is immutable', function () {
      var req = yea.urlencoded({ hey: 'hi' });
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.timeout', function () {
    it('sets timeout', function () {
      expect(yea.timeout(null).toObject().timeout).to.equal(null);
      expect(yea.timeout(0).toObject().timeout).to.equal(null);
      expect(yea.timeout(99).toObject().timeout).to.equal(99);
    });

    it('throws on unexpected type', function () {
      expect(function () {
        yea.timeout({});
      }).to.throw('Expected a number for timeout');

      expect(function () {
        yea.timeout([]);
      }).to.throw('Expected a number for timeout');

      expect(function () {
        yea.timeout(function () {});
      }).to.throw('Expected a number for timeout');
    });

    it('is immutable', function () {
      var req = yea.timeout(99);
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.unsetTimeout', function () {
    it('unsets timeout', function () {
      expect(yea.timeout(99).unsetTimeout().toObject().timeout).to.equal(null);
    });

    it('is immutable', function () {
      var req = yea.unsetTimeout();
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.send', function () {
    it('exists (see requests.spec.js for more tests)', function () {
      expect(yea.send).to.be.ok;
    });
  });

  describe('.sendUrlencoded', function () {
    it('exists (see requests.spec.js for more tests)', function () {
      expect(yea.sendUrlencoded).to.be.ok;
    });
  });

  describe('.sendJson', function () {
    it('exists (see requests.spec.js for more tests)', function () {
      expect(yea.sendJson).to.be.ok;
    });
  });

  describe('.then', function () {
    it('exists (see requests.spec.js for more tests)', function () {
      expect(yea.then).to.be.ok;
    });
  });

  describe('.setResponseTransformers', function () {
    var fn = function () {};

    it('sets response transformers', function () {
      expect(yea.setResponseTransformers([]).toObject().responseTransformers).to.deep.equal([]);
      expect(yea.setResponseTransformers([fn]).toObject().responseTransformers).to.deep.equal([fn]);
      expect(yea.setResponseTransformers([fn, fn]).toObject().responseTransformers).to.deep.equal([fn, fn]);
    });

    it('throws on unexpected type', function () {
      expect(function () {
        yea.setResponseTransformers({});
      }).to.throw('Expected an array of response transformers');

      expect(function () {
        yea.setResponseTransformers(function () {});
      }).to.throw('Expected an array of response transformers');

      expect(function () {
        yea.setResponseTransformers([null]);
      }).to.throw('One or more response transformer is not a function');

      expect(function () {
        yea.setResponseTransformers([fn, null]);
      }).to.throw('One or more response transformer is not a function');
    });

    it('leaves no reference to the array', function () {
      var array = [fn];
      var req = yea.setResponseTransformers(array);
      expect(req.toObject().responseTransformers).to.not.equal(array);
      array.splice(0, 1);
      expect(req.toObject().responseTransformers).to.deep.equal([fn]);
    });

    it('is immutable', function () {
      var req = yea.setResponseTransformers([]);
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.setAllowedStatusCode', function () {
    var fn = function () {};

    it('sets allowed status code', function () {
      expect(yea.setAllowedStatusCode(200).toObject().allowedStatusCode).to.equal(200);
      expect(yea.setAllowedStatusCode(/asd/).toObject().allowedStatusCode).to.deep.equal(/asd/);
      expect(yea.setAllowedStatusCode(fn).toObject().allowedStatusCode).to.equal(fn);
    });

    it('throws on unexpected type', function () {
      expect(function () {
        yea.setAllowedStatusCode('foo');
      }).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');

      expect(function () {
        yea.setAllowedStatusCode({});
      }).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');

      expect(function () {
        yea.setAllowedStatusCode([]);
      }).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');

      expect(function () {
        yea.setAllowedStatusCode(null);
      }).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
    });

    it('is immutable', function () {
      var req = yea.setAllowedStatusCode(200);
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.polyfills', function () {
    var dummy = function () {};

    it('sets Promise', function () {
      expect(yea.polyfills({ Promise: dummy }).toObject().polyfills.Promise).to.equal(dummy);
    });

    it('leaves no reference to the object', function () {
      var object = { Promise: dummy };
      expect(yea.polyfills(object).toObject().polyfills).to.not.equal(object);
    });

    it('allows clearing all', function () {
      expect(yea.polyfills({ Promise: dummy }).polyfills(null).toObject().polyfills).to.deep.equal({});
    });

    it('is immutable', function () {
      var req = yea.polyfills({ Promise: dummy });
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.toObject', function () {
    it('returns a no-reference copy of request config', function () {
      var object = yea.toObject();
      expect(object).to.deep.equal(yea._config);
      expect(object).to.not.equal(yea._config);
      expect(object.headers).to.not.equal(yea._config.headers);
      expect(object.responseTransformers).to.not.equal(yea._config.responseTransformers);
      expect(object.polyfills).to.not.equal(yea._config.polyfills);
    });

    it('has alias .config', function () {
      var object = yea.toObject();
      expect(object).to.deep.equal(yea._config);
      expect(object).to.not.equal(yea._config);
      expect(object.headers).to.not.equal(yea._config.headers);
      expect(object.responseTransformers).to.not.equal(yea._config.responseTransformers);
      expect(object.polyfills).to.not.equal(yea._config.polyfills);
    });

    it('has alias .debug', function () {
      var object = yea.toObject();
      expect(object).to.deep.equal(yea._config);
      expect(object).to.not.equal(yea._config);
      expect(object.headers).to.not.equal(yea._config.headers);
      expect(object.responseTransformers).to.not.equal(yea._config.responseTransformers);
      expect(object.polyfills).to.not.equal(yea._config.polyfills);
    });
  });
});
