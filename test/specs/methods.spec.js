describe('Methods', () => {
  describe('defaults', () => {
    it('has defaults', () => {
      const defaults = supremeAjax.toObject();
      expect(defaults).to.have.keys(['method', 'baseUrl', 'url', 'body', 'headers', 'responseTransformers', 'allowedStatusCode', 'timeout', 'polyfills']);
      expect(defaults.method).to.equal('GET');
      expect(defaults.baseUrl).to.equal('');
      expect(defaults.url).to.equal('');
      expect(defaults.body).to.equal('');
      expect(defaults.headers).to.deep.equal({});
      expect(defaults.responseTransformers).to.deep.equal([supremeAjax.jsonResponseTransformer]);
      expect(defaults.allowedStatusCode).to.deep.equal(/^2[0-9]{2}$/);
      expect(defaults.timeout).to.equal(null);
      expect(defaults.polyfills).to.deep.equal({});
    });
  });

  describe('.get', () => {
    it('sets method and URL', () => {
      expect(supremeAjax.get('http://example.com/foo').toObject().method).to.equal('GET');
      expect(supremeAjax.get('http://example.com/foo').toObject().url).to.equal('http://example.com/foo');
    });

    it('is immutable', () => {
      const req = supremeAjax.get('http://example.com/foo');
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.post', () => {
    it('sets method and URL', () => {
      expect(supremeAjax.post('http://example.com/foo').toObject().method).to.equal('POST');
      expect(supremeAjax.post('http://example.com/foo').toObject().url).to.equal('http://example.com/foo');
    });

    it('is immutable', () => {
      const req = supremeAjax.post('http://example.com/foo');
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.method', () => {
    it('sets method', () => {
      expect(supremeAjax.method('GET').toObject().method).to.equal('GET');
    });

    it('is case-insensitive', () => {
      expect(supremeAjax.method('get').toObject().method).to.equal('GET');
      expect(supremeAjax.method('gEt').toObject().method).to.equal('GET');
    });

    it('is immutable', () => {
      const req = supremeAjax.method('get');
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.url', () => {
    it('sets url', () => {
      expect(supremeAjax.url('http://example.com').toObject().url).to.equal('http://example.com');
    });

    it('sets query', () => {
      expect(supremeAjax.url('http://example.com?hello=yes').toObject().url).to.equal('http://example.com');
      expect(supremeAjax.url('http://example.com?hello=yes').toObject().query).to.equal('hello=yes');
    });

    it('unsets previous query', () => {
      expect(supremeAjax.url('http://example.com?hello=yes').url('http://example.com/foo').toObject().query).to.equal('');
    });

    it('is immutable', () => {
      const req = supremeAjax.url('http://example.com');
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.baseUrl', () => {
    it('sets baseUrl', () => {
      expect(supremeAjax.baseUrl('http://example.com').toObject().baseUrl).to.equal('http://example.com');
    });

    it('allows unsetting baseUrl', () => {
      expect(supremeAjax.baseUrl('').toObject().baseUrl).to.equal('');
      expect(supremeAjax.baseUrl(null).toObject().baseUrl).to.equal('');
    });

    it('is immutable', () => {
      const req = supremeAjax.baseUrl('http://example.com');
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.query', () => {
    it('sets query from a string', () => {
      expect(supremeAjax.query('foo=bar&example=xyz').toObject().query).to.equal('foo=bar&example=xyz');
    });

    it('sets query from an object', () => {
      expect(supremeAjax.query({ foo: 'bar', example: 'xyz' }).toObject().query).to.equal('foo=bar&example=xyz');
      expect(supremeAjax.query({ example: 'xyz', foo: 'bar' }).toObject().query).to.equal('example=xyz&foo=bar');
    });

    it('overwrites previous query', () => {
      expect(supremeAjax.query({ foo: 'bar', example: 'xyz' }).query({ new: 'query' }).toObject().query).to.equal('new=query');
    });

    it('stringifies given object into query string', () => {
      expect(supremeAjax.query({}).toObject().query).to.equal('');
      expect(supremeAjax.query({ foo: 'bar' }).toObject().query).to.equal('foo=bar');
      expect(supremeAjax.query({ foo: 'bar', baz: 'xyz' }).toObject().query).to.equal('foo=bar&baz=xyz');
      expect(supremeAjax.query({ foo: [] }).toObject().query).to.equal('');
      expect(supremeAjax.query({ foo: ['one', 'two'] }).toObject().query).to.equal('foo=one&foo=two');
      expect(supremeAjax.query({ foo: ['two', 'one'] }).toObject().query).to.equal('foo=two&foo=one');
    });

    it('uses polyfilled URLSearchParams if set', () => {
      function MyURLSearchParams() {}
      MyURLSearchParams.prototype.append = () => {};
      MyURLSearchParams.prototype.toString = () => 'fake query';
      expect(supremeAjax.polyfills({ URLSearchParams: MyURLSearchParams }).query({ foo: 'bar' }).toObject().query).to.equal('fake query');
    });

    it('is immutable', () => {
      const req = supremeAjax.query('foo=bar&example=xyz');
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.headers', () => {
    it('sets headers', () => {
      expect(supremeAjax.headers({ super: 'yes' }).toObject().headers).to.deep.equal({ super: 'yes' });
    });

    it('overwrites existing headers', () => {
      const req = supremeAjax.headers({ super: 'yes', foo: 'sir' });
      expect(req.headers({ foo: 'bar', fresh: 'sure' }).toObject().headers).to.deep.equal({ foo: 'bar', fresh: 'sure' });
    });

    it('leaves no references', () => {
      const headers = { super: 'yes' };
      const req = supremeAjax.headers(headers);
      expect(req.toObject().headers).to.not.equal(headers);
      headers.super = 'modified';
      expect(req.toObject().headers.super).to.equal('yes');
    });

    it('converts values to string', () => {
      expect(supremeAjax.headers({ super: 123 }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('considers keys lowercase', () => {
      expect(supremeAjax.headers({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('throws on unexpected types', () => {
      expect(() => supremeAjax.headers({ super: {} })).to.throw('Invalid header value for header \'super\'');
      expect(() => supremeAjax.headers({ super: [] })).to.throw('Invalid header value for header \'super\'');
      expect(() => supremeAjax.headers({ super: expect })).to.throw('Invalid header value for header \'super\'');
    });

    it('is immutable', () => {
      const req = supremeAjax.headers({ super: 123 });
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.amendHeaders', () => {
    it('sets headers even if there are none', () => {
      expect(supremeAjax.amendHeaders({ super: 'yes' }).toObject().headers).to.deep.equal({ super: 'yes' });
    });

    it('overwrites existing values for keys present in the object', () => {
      const req = supremeAjax.headers({ super: 'yes', foo: 'sir' });
      expect(req.amendHeaders({ foo: 'bar', fresh: 'sure' }).toObject().headers).to.deep.equal({ super: 'yes', foo: 'bar', fresh: 'sure' });
    });

    it('leaves no references', () => {
      const headers = { super: 'yes' };
      expect(supremeAjax.amendHeaders(headers).toObject().headers).to.not.equal(headers);
    });

    it('converts values to string', () => {
      expect(supremeAjax.amendHeaders({ super: 123 }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('considers keys lowercase', () => {
      expect(supremeAjax.amendHeaders({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
      expect(supremeAjax.headers({ super: 'foo' }).amendHeaders({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('throws on unexpected types', () => {
      expect(() => supremeAjax.amendHeaders({ super: {} })).to.throw('Invalid header value for header \'super\'');
      expect(() => supremeAjax.amendHeaders({ super: [] })).to.throw('Invalid header value for header \'super\'');
      expect(() => supremeAjax.amendHeaders({ super: expect })).to.throw('Invalid header value for header \'super\'');
    });

    it('is immutable', () => {
      const req = supremeAjax.amendHeaders({ super: 123 });
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.unsetHeader', () => {
    it('accepts non-existent header', () => {
      expect(supremeAjax.headers({}).unsetHeader('foo').toObject().headers).to.deep.equal({});
      expect(supremeAjax.headers({ bar: 'one' }).unsetHeader('foo').toObject().headers).to.deep.equal({ bar: 'one' });
    });

    it('unsets header', () => {
      expect(supremeAjax.headers({ foo: 'bar', fresh: 'sure' }).unsetHeader('foo').toObject().headers).to.deep.equal({ fresh: 'sure' });
    });

    it('considers keys lowercase', () => {
      expect(supremeAjax.headers({ super: 'foo' }).unsetHeader('SUPER').toObject().headers).to.deep.equal({});
    });

    it('is immutable', () => {
      const req = supremeAjax.unsetHeader('foo');
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.body', () => {
    it('sets body', () => {
      expect(supremeAjax.body('holla').toObject().body).to.equal('holla');
    });

    it('converts values to string', () => {
      expect(supremeAjax.body(123).toObject().body).to.equal('123');
    });

    it('throws on unexpected types', () => {
      expect(() => supremeAjax.body({})).to.throw('Unexpected type for request body');
      expect(() => supremeAjax.body([])).to.throw('Unexpected type for request body');
      expect(() => supremeAjax.body(expect)).to.throw('Unexpected type for request body');
    });

    it('is immutable', () => {
      const req = supremeAjax.body('holla');
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.json', () => {
    it('sets request body to encoded JSON', () => {
      expect(supremeAjax.json('holla').toObject().body).to.equal('"holla"');
      expect(supremeAjax.json(null).toObject().body).to.equal('null');
      expect(supremeAjax.json([]).toObject().body).to.equal('[]');
      expect(supremeAjax.json({ hey: 'hi' }).toObject().body).to.equal('{"hey":"hi"}');
    });

    it('sets content-type header to application/json', () => {
      expect(supremeAjax.json('holla').toObject().headers['content-type']).to.equal('application/json');
    });

    it('is immutable', () => {
      const req = supremeAjax.json('holla');
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.urlencoded', () => {
    it('sets request body to urlencoded data', () => {
      expect(supremeAjax.urlencoded({ hey: 'hi' }).toObject().body).to.equal('hey=hi');
    });

    it('sets content-type header to application/x-www-form-urlencoded', () => {
      expect(supremeAjax.urlencoded('holla').toObject().headers['content-type']).to.equal('application/x-www-form-urlencoded');
    });

    it('uses polyfilled URLSearchParams if set', () => {
      function MyURLSearchParams() {}
      MyURLSearchParams.prototype.append = () => {};
      MyURLSearchParams.prototype.toString = () => 'fake query';
      expect(supremeAjax.polyfills({ URLSearchParams: MyURLSearchParams }).urlencoded({ hey: 'hi' }).toObject().body).to.equal('fake query');
    });

    it('is immutable', () => {
      const req = supremeAjax.urlencoded({ hey: 'hi' });
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.timeout', () => {
    it('sets timeout', () => {
      expect(supremeAjax.timeout(null).toObject().timeout).to.equal(null);
      expect(supremeAjax.timeout(0).toObject().timeout).to.equal(null);
      expect(supremeAjax.timeout(99).toObject().timeout).to.equal(99);
    });

    it('throws on unexpected type', () => {
      expect(() => supremeAjax.timeout({})).to.throw('Expected a number for timeout');
      expect(() => supremeAjax.timeout([])).to.throw('Expected a number for timeout');
      expect(() => supremeAjax.timeout(expect)).to.throw('Expected a number for timeout');
    });

    it('is immutable', () => {
      const req = supremeAjax.timeout(99);
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.unsetTimeout', () => {
    it('unsets timeout', () => {
      expect(supremeAjax.timeout(99).unsetTimeout().toObject().timeout).to.equal(null);
    });

    it('is immutable', () => {
      const req = supremeAjax.unsetTimeout();
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.send', () => {
    it('exists (see requests.spec.js for more tests)', () => {
      expect(supremeAjax.send).to.be.ok;
    });
  });

  describe('.setResponseTransformers', () => {
    const fn = () => {};

    it('sets response transformers', () => {
      expect(supremeAjax.setResponseTransformers([]).toObject().responseTransformers).to.deep.equal([]);
      expect(supremeAjax.setResponseTransformers([fn]).toObject().responseTransformers).to.deep.equal([fn]);
      expect(supremeAjax.setResponseTransformers([fn, fn]).toObject().responseTransformers).to.deep.equal([fn, fn]);
    });

    it('throws on unexpected type', () => {
      expect(() => supremeAjax.setResponseTransformers({})).to.throw('Expected an array of response transformers');
      expect(() => supremeAjax.setResponseTransformers(expect)).to.throw('Expected an array of response transformers');
      expect(() => supremeAjax.setResponseTransformers([null])).to.throw('One or more response transformer is not a function');
      expect(() => supremeAjax.setResponseTransformers([fn, null])).to.throw('One or more response transformer is not a function');
    });

    it('leaves no reference to the array', () => {
      const array = [fn];
      const req = supremeAjax.setResponseTransformers(array);
      expect(req.toObject().responseTransformers).to.not.equal(array);
      array.splice(0, 1);
      expect(req.toObject().responseTransformers).to.deep.equal([fn]);
    });

    it('is immutable', () => {
      const req = supremeAjax.setResponseTransformers([]);
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.setAllowedStatusCode', () => {
    const fn = () => {};

    it('sets allowed status code', () => {
      expect(supremeAjax.setAllowedStatusCode(200).toObject().allowedStatusCode).to.equal(200);
      expect(supremeAjax.setAllowedStatusCode(/asd/).toObject().allowedStatusCode).to.deep.equal(/asd/);
      expect(supremeAjax.setAllowedStatusCode(fn).toObject().allowedStatusCode).to.equal(fn);
    });

    it('throws on unexpected type', () => {
      expect(() => supremeAjax.setAllowedStatusCode('foo')).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
      expect(() => supremeAjax.setAllowedStatusCode({})).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
      expect(() => supremeAjax.setAllowedStatusCode([])).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
      expect(() => supremeAjax.setAllowedStatusCode(null)).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
    });

    it('is immutable', () => {
      const req = supremeAjax.setAllowedStatusCode(200);
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.polyfills', () => {
    const dummy = () => {};

    it('sets Promise', () => {
      expect(supremeAjax.polyfills({ Promise: dummy }).toObject().polyfills.Promise).to.equal(dummy);
    });

    it('sets URLSearchParams', () => {
      expect(supremeAjax.polyfills({ URLSearchParams: dummy }).toObject().polyfills.URLSearchParams).to.equal(dummy);
    });

    it('leaves no reference to the object', () => {
      const object = { Promise: dummy };
      expect(supremeAjax.polyfills(object).toObject().polyfills).to.not.equal(object);
    });

    it('allows clearing all', () => {
      expect(supremeAjax.polyfills({ Promise: dummy }).polyfills(null).toObject().polyfills).to.deep.equal({});
    });

    it('is immutable', () => {
      const req = supremeAjax.polyfills({ Promise: dummy });
      expect(req).to.not.equal(supremeAjax);
      expect(req.constructor).to.equal(supremeAjax.constructor);
    });
  });

  describe('.toObject', () => {
    it('returns a no-reference copy of request config', () => {
      const object = supremeAjax.toObject();
      expect(object).to.deep.equal(supremeAjax._config);
      expect(object).to.not.equal(supremeAjax._config);
      expect(object.headers).to.not.equal(supremeAjax._config.headers);
      expect(object.responseTransformers).to.not.equal(supremeAjax._config.responseTransformers);
      expect(object.polyfills).to.not.equal(supremeAjax._config.polyfills);
    });

    it('has alias .config', () => {
      const object = supremeAjax.toObject();
      expect(object).to.deep.equal(supremeAjax._config);
      expect(object).to.not.equal(supremeAjax._config);
      expect(object.headers).to.not.equal(supremeAjax._config.headers);
      expect(object.responseTransformers).to.not.equal(supremeAjax._config.responseTransformers);
      expect(object.polyfills).to.not.equal(supremeAjax._config.polyfills);
    });

    it('has alias .debug', () => {
      const object = supremeAjax.toObject();
      expect(object).to.deep.equal(supremeAjax._config);
      expect(object).to.not.equal(supremeAjax._config);
      expect(object.headers).to.not.equal(supremeAjax._config.headers);
      expect(object.responseTransformers).to.not.equal(supremeAjax._config.responseTransformers);
      expect(object.polyfills).to.not.equal(supremeAjax._config.polyfills);
    });
  });
});
