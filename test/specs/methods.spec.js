describe('Methods', () => {
  describe('defaults', () => {
    it('has defaults', () => {
      const defaults = yea.toObject();
      expect(defaults).to.have.keys(['method', 'baseUrl', 'url', 'body', 'headers', 'responseTransformers', 'allowedStatusCode', 'timeout', 'polyfills']);
      expect(defaults.method).to.equal('GET');
      expect(defaults.baseUrl).to.equal('');
      expect(defaults.url).to.equal('');
      expect(defaults.body).to.equal('');
      expect(defaults.headers).to.deep.equal({});
      expect(defaults.responseTransformers).to.deep.equal([yea.jsonResponseTransformer]);
      expect(defaults.allowedStatusCode).to.deep.equal(/^2[0-9]{2}$/);
      expect(defaults.timeout).to.equal(null);
      expect(defaults.polyfills).to.deep.equal({});
    });
  });

  describe('constructor', () => {
    it('throws if used as a function', () => {
      expect(() => yea()).to.throw('yea is not a function');
    });

    it('throws if used as a constructor', () => {
      expect(() => new yea).to.throw('yea is not a constructor');
      expect(() => new yea()).to.throw('yea is not a constructor');
    });
  });

  describe('.get', () => {
    it('sets method and URL', () => {
      expect(yea.get('http://example.com/foo').toObject().method).to.equal('GET');
      expect(yea.get('http://example.com/foo').toObject().url).to.equal('http://example.com/foo');
    });

    it('is immutable', () => {
      const req = yea.get('http://example.com/foo');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.post', () => {
    it('sets method and URL', () => {
      expect(yea.post('http://example.com/foo').toObject().method).to.equal('POST');
      expect(yea.post('http://example.com/foo').toObject().url).to.equal('http://example.com/foo');
    });

    it('is immutable', () => {
      const req = yea.post('http://example.com/foo');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.method', () => {
    it('sets method', () => {
      expect(yea.method('GET').toObject().method).to.equal('GET');
    });

    it('is case-insensitive', () => {
      expect(yea.method('get').toObject().method).to.equal('GET');
      expect(yea.method('gEt').toObject().method).to.equal('GET');
    });

    it('is immutable', () => {
      const req = yea.method('get');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.url', () => {
    it('sets url', () => {
      expect(yea.url('http://example.com').toObject().url).to.equal('http://example.com');
    });

    it('sets query', () => {
      expect(yea.url('http://example.com?hello=yes').toObject().url).to.equal('http://example.com');
      expect(yea.url('http://example.com?hello=yes').toObject().query).to.equal('hello=yes');
    });

    it('unsets previous query', () => {
      expect(yea.url('http://example.com?hello=yes').url('http://example.com/foo').toObject().query).to.equal('');
    });

    it('is immutable', () => {
      const req = yea.url('http://example.com');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.baseUrl', () => {
    it('sets baseUrl', () => {
      expect(yea.baseUrl('http://example.com').toObject().baseUrl).to.equal('http://example.com');
    });

    it('allows unsetting baseUrl', () => {
      expect(yea.baseUrl('').toObject().baseUrl).to.equal('');
      expect(yea.baseUrl(null).toObject().baseUrl).to.equal('');
    });

    it('is immutable', () => {
      const req = yea.baseUrl('http://example.com');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.query', () => {
    it('sets query from a string', () => {
      expect(yea.query('foo=bar&example=xyz').toObject().query).to.equal('foo=bar&example=xyz');
    });

    it('sets query from an object', () => {
      expect(yea.query({ foo: 'bar', example: 'xyz' }).toObject().query).to.equal('foo=bar&example=xyz');
      expect(yea.query({ example: 'xyz', foo: 'bar' }).toObject().query).to.equal('example=xyz&foo=bar');
    });

    it('overwrites previous query', () => {
      expect(yea.query({ foo: 'bar', example: 'xyz' }).query({ new: 'query' }).toObject().query).to.equal('new=query');
    });

    it('stringifies given object into query string', () => {
      expect(yea.query({}).toObject().query).to.equal('');
      expect(yea.query({ foo: 'bar' }).toObject().query).to.equal('foo=bar');
      expect(yea.query({ foo: 'bar', baz: 'xyz' }).toObject().query).to.equal('foo=bar&baz=xyz');
      expect(yea.query({ foo: [] }).toObject().query).to.equal('');
      expect(yea.query({ foo: ['one', 'two'] }).toObject().query).to.equal('foo=one&foo=two');
      expect(yea.query({ foo: ['two', 'one'] }).toObject().query).to.equal('foo=two&foo=one');
    });

    it('uses polyfilled URLSearchParams if set', () => {
      function MyURLSearchParams() {}
      MyURLSearchParams.prototype.append = () => {};
      MyURLSearchParams.prototype.toString = () => 'fake query';
      expect(yea.polyfills({ URLSearchParams: MyURLSearchParams }).query({ foo: 'bar' }).toObject().query).to.equal('fake query');
    });

    it('is immutable', () => {
      const req = yea.query('foo=bar&example=xyz');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.headers', () => {
    it('sets headers', () => {
      expect(yea.headers({ super: 'yes' }).toObject().headers).to.deep.equal({ super: 'yes' });
    });

    it('overwrites existing headers', () => {
      const req = yea.headers({ super: 'yes', foo: 'sir' });
      expect(req.headers({ foo: 'bar', fresh: 'sure' }).toObject().headers).to.deep.equal({ foo: 'bar', fresh: 'sure' });
    });

    it('leaves no references', () => {
      const headers = { super: 'yes' };
      const req = yea.headers(headers);
      expect(req.toObject().headers).to.not.equal(headers);
      headers.super = 'modified';
      expect(req.toObject().headers.super).to.equal('yes');
    });

    it('converts values to string', () => {
      expect(yea.headers({ super: 123 }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('considers keys lowercase', () => {
      expect(yea.headers({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('throws on unexpected types', () => {
      expect(() => yea.headers({ super: {} })).to.throw('Invalid header value for header \'super\'');
      expect(() => yea.headers({ super: [] })).to.throw('Invalid header value for header \'super\'');
      expect(() => yea.headers({ super: expect })).to.throw('Invalid header value for header \'super\'');
    });

    it('is immutable', () => {
      const req = yea.headers({ super: 123 });
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.amendHeaders', () => {
    it('sets headers even if there are none', () => {
      expect(yea.amendHeaders({ super: 'yes' }).toObject().headers).to.deep.equal({ super: 'yes' });
    });

    it('overwrites existing values for keys present in the object', () => {
      const req = yea.headers({ super: 'yes', foo: 'sir' });
      expect(req.amendHeaders({ foo: 'bar', fresh: 'sure' }).toObject().headers).to.deep.equal({ super: 'yes', foo: 'bar', fresh: 'sure' });
    });

    it('leaves no references', () => {
      const headers = { super: 'yes' };
      expect(yea.amendHeaders(headers).toObject().headers).to.not.equal(headers);
    });

    it('converts values to string', () => {
      expect(yea.amendHeaders({ super: 123 }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('considers keys lowercase', () => {
      expect(yea.amendHeaders({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
      expect(yea.headers({ super: 'foo' }).amendHeaders({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('throws on unexpected types', () => {
      expect(() => yea.amendHeaders({ super: {} })).to.throw('Invalid header value for header \'super\'');
      expect(() => yea.amendHeaders({ super: [] })).to.throw('Invalid header value for header \'super\'');
      expect(() => yea.amendHeaders({ super: expect })).to.throw('Invalid header value for header \'super\'');
    });

    it('is immutable', () => {
      const req = yea.amendHeaders({ super: 123 });
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.unsetHeader', () => {
    it('accepts non-existent header', () => {
      expect(yea.headers({}).unsetHeader('foo').toObject().headers).to.deep.equal({});
      expect(yea.headers({ bar: 'one' }).unsetHeader('foo').toObject().headers).to.deep.equal({ bar: 'one' });
    });

    it('unsets header', () => {
      expect(yea.headers({ foo: 'bar', fresh: 'sure' }).unsetHeader('foo').toObject().headers).to.deep.equal({ fresh: 'sure' });
    });

    it('considers keys lowercase', () => {
      expect(yea.headers({ super: 'foo' }).unsetHeader('SUPER').toObject().headers).to.deep.equal({});
    });

    it('is immutable', () => {
      const req = yea.unsetHeader('foo');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.body', () => {
    it('sets body', () => {
      expect(yea.body('holla').toObject().body).to.equal('holla');
    });

    it('converts values to string', () => {
      expect(yea.body(123).toObject().body).to.equal('123');
    });

    it('throws on unexpected types', () => {
      expect(() => yea.body({})).to.throw('Unexpected type for request body');
      expect(() => yea.body([])).to.throw('Unexpected type for request body');
      expect(() => yea.body(expect)).to.throw('Unexpected type for request body');
    });

    it('is immutable', () => {
      const req = yea.body('holla');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.json', () => {
    it('sets request body to encoded JSON', () => {
      expect(yea.json('holla').toObject().body).to.equal('"holla"');
      expect(yea.json(null).toObject().body).to.equal('null');
      expect(yea.json([]).toObject().body).to.equal('[]');
      expect(yea.json({ hey: 'hi' }).toObject().body).to.equal('{"hey":"hi"}');
    });

    it('sets content-type header to application/json', () => {
      expect(yea.json('holla').toObject().headers['content-type']).to.equal('application/json');
    });

    it('is immutable', () => {
      const req = yea.json('holla');
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.urlencoded', () => {
    it('sets request body to urlencoded data', () => {
      expect(yea.urlencoded({ hey: 'hi' }).toObject().body).to.equal('hey=hi');
    });

    it('sets content-type header to application/x-www-form-urlencoded', () => {
      expect(yea.urlencoded('holla').toObject().headers['content-type']).to.equal('application/x-www-form-urlencoded');
    });

    it('uses polyfilled URLSearchParams if set', () => {
      function MyURLSearchParams() {}
      MyURLSearchParams.prototype.append = () => {};
      MyURLSearchParams.prototype.toString = () => 'fake query';
      expect(yea.polyfills({ URLSearchParams: MyURLSearchParams }).urlencoded({ hey: 'hi' }).toObject().body).to.equal('fake query');
    });

    it('is immutable', () => {
      const req = yea.urlencoded({ hey: 'hi' });
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.timeout', () => {
    it('sets timeout', () => {
      expect(yea.timeout(null).toObject().timeout).to.equal(null);
      expect(yea.timeout(0).toObject().timeout).to.equal(null);
      expect(yea.timeout(99).toObject().timeout).to.equal(99);
    });

    it('throws on unexpected type', () => {
      expect(() => yea.timeout({})).to.throw('Expected a number for timeout');
      expect(() => yea.timeout([])).to.throw('Expected a number for timeout');
      expect(() => yea.timeout(expect)).to.throw('Expected a number for timeout');
    });

    it('is immutable', () => {
      const req = yea.timeout(99);
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.unsetTimeout', () => {
    it('unsets timeout', () => {
      expect(yea.timeout(99).unsetTimeout().toObject().timeout).to.equal(null);
    });

    it('is immutable', () => {
      const req = yea.unsetTimeout();
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.send', () => {
    it('exists (see requests.spec.js for more tests)', () => {
      expect(yea.send).to.be.ok;
    });
  });

  describe('.sendUrlencoded', () => {
    it('exists (see requests.spec.js for more tests)', () => {
      expect(yea.sendUrlencoded).to.be.ok;
    });
  });

  describe('.sendJson', () => {
    it('exists (see requests.spec.js for more tests)', () => {
      expect(yea.sendJson).to.be.ok;
    });
  });

  describe('.setResponseTransformers', () => {
    const fn = () => {};

    it('sets response transformers', () => {
      expect(yea.setResponseTransformers([]).toObject().responseTransformers).to.deep.equal([]);
      expect(yea.setResponseTransformers([fn]).toObject().responseTransformers).to.deep.equal([fn]);
      expect(yea.setResponseTransformers([fn, fn]).toObject().responseTransformers).to.deep.equal([fn, fn]);
    });

    it('throws on unexpected type', () => {
      expect(() => yea.setResponseTransformers({})).to.throw('Expected an array of response transformers');
      expect(() => yea.setResponseTransformers(expect)).to.throw('Expected an array of response transformers');
      expect(() => yea.setResponseTransformers([null])).to.throw('One or more response transformer is not a function');
      expect(() => yea.setResponseTransformers([fn, null])).to.throw('One or more response transformer is not a function');
    });

    it('leaves no reference to the array', () => {
      const array = [fn];
      const req = yea.setResponseTransformers(array);
      expect(req.toObject().responseTransformers).to.not.equal(array);
      array.splice(0, 1);
      expect(req.toObject().responseTransformers).to.deep.equal([fn]);
    });

    it('is immutable', () => {
      const req = yea.setResponseTransformers([]);
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.setAllowedStatusCode', () => {
    const fn = () => {};

    it('sets allowed status code', () => {
      expect(yea.setAllowedStatusCode(200).toObject().allowedStatusCode).to.equal(200);
      expect(yea.setAllowedStatusCode(/asd/).toObject().allowedStatusCode).to.deep.equal(/asd/);
      expect(yea.setAllowedStatusCode(fn).toObject().allowedStatusCode).to.equal(fn);
    });

    it('throws on unexpected type', () => {
      expect(() => yea.setAllowedStatusCode('foo')).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
      expect(() => yea.setAllowedStatusCode({})).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
      expect(() => yea.setAllowedStatusCode([])).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
      expect(() => yea.setAllowedStatusCode(null)).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
    });

    it('is immutable', () => {
      const req = yea.setAllowedStatusCode(200);
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.polyfills', () => {
    const dummy = () => {};

    it('sets Promise', () => {
      expect(yea.polyfills({ Promise: dummy }).toObject().polyfills.Promise).to.equal(dummy);
    });

    it('sets URLSearchParams', () => {
      expect(yea.polyfills({ URLSearchParams: dummy }).toObject().polyfills.URLSearchParams).to.equal(dummy);
    });

    it('leaves no reference to the object', () => {
      const object = { Promise: dummy };
      expect(yea.polyfills(object).toObject().polyfills).to.not.equal(object);
    });

    it('allows clearing all', () => {
      expect(yea.polyfills({ Promise: dummy }).polyfills(null).toObject().polyfills).to.deep.equal({});
    });

    it('is immutable', () => {
      const req = yea.polyfills({ Promise: dummy });
      expect(req).to.not.equal(yea);
      expect(req.constructor).to.equal(yea.constructor);
    });
  });

  describe('.toObject', () => {
    it('returns a no-reference copy of request config', () => {
      const object = yea.toObject();
      expect(object).to.deep.equal(yea._config);
      expect(object).to.not.equal(yea._config);
      expect(object.headers).to.not.equal(yea._config.headers);
      expect(object.responseTransformers).to.not.equal(yea._config.responseTransformers);
      expect(object.polyfills).to.not.equal(yea._config.polyfills);
    });

    it('has alias .config', () => {
      const object = yea.toObject();
      expect(object).to.deep.equal(yea._config);
      expect(object).to.not.equal(yea._config);
      expect(object.headers).to.not.equal(yea._config.headers);
      expect(object.responseTransformers).to.not.equal(yea._config.responseTransformers);
      expect(object.polyfills).to.not.equal(yea._config.polyfills);
    });

    it('has alias .debug', () => {
      const object = yea.toObject();
      expect(object).to.deep.equal(yea._config);
      expect(object).to.not.equal(yea._config);
      expect(object.headers).to.not.equal(yea._config.headers);
      expect(object.responseTransformers).to.not.equal(yea._config.responseTransformers);
      expect(object.polyfills).to.not.equal(yea._config.polyfills);
    });
  });
});
