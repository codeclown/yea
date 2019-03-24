describe('ImmutableAjaxRequest', () => {
  describe('ImmutableAjaxRequest', () => {
    it('has defaults', () => {
      const defaults = request.toObject();
      expect(defaults).to.have.keys(['method', 'baseUrl', 'url', 'body', 'headers', 'responseTransformers', 'allowedStatusCode', 'timeout', 'polyfills']);
      expect(defaults.method).to.equal('GET');
      expect(defaults.baseUrl).to.equal('');
      expect(defaults.url).to.equal('');
      expect(defaults.body).to.equal('');
      expect(defaults.headers).to.deep.equal({});
      expect(defaults.responseTransformers).to.deep.equal([request.jsonResponseTransformer]);
      expect(defaults.allowedStatusCode).to.deep.equal(/^2[0-9]{2}$/);
      expect(defaults.timeout).to.equal(null);
      expect(defaults.polyfills).to.deep.equal({});
    });

    it('exposes jsonResponseTransformer', () => {
      expect(request.jsonResponseTransformer).to.be.a('function');
    });
  });

  describe('.get', () => {
    it('sets method and URL', () => {
      expect(request.get('http://example.com/foo').toObject().method).to.equal('GET');
      expect(request.get('http://example.com/foo').toObject().url).to.equal('http://example.com/foo');
    });

    it('is immutable', () => {
      const req = request.get('http://example.com/foo');
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.post', () => {
    it('sets method and URL', () => {
      expect(request.post('http://example.com/foo').toObject().method).to.equal('POST');
      expect(request.post('http://example.com/foo').toObject().url).to.equal('http://example.com/foo');
    });

    it('is immutable', () => {
      const req = request.post('http://example.com/foo');
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.method', () => {
    it('sets method', () => {
      expect(request.method('GET').toObject().method).to.equal('GET');
    });

    it('is case-insensitive', () => {
      expect(request.method('get').toObject().method).to.equal('GET');
      expect(request.method('gEt').toObject().method).to.equal('GET');
    });

    it('is immutable', () => {
      const req = request.method('get');
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.url', () => {
    it('sets url', () => {
      expect(request.url('http://example.com').toObject().url).to.equal('http://example.com');
    });

    it('sets query', () => {
      expect(request.url('http://example.com?hello=yes').toObject().url).to.equal('http://example.com');
      expect(request.url('http://example.com?hello=yes').toObject().query).to.equal('hello=yes');
    });

    it('unsets previous query', () => {
      expect(request.url('http://example.com?hello=yes').url('http://example.com/foo').toObject().query).to.equal('');
    });

    it('is immutable', () => {
      const req = request.url('http://example.com');
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.baseUrl', () => {
    it('sets baseUrl', () => {
      expect(request.baseUrl('http://example.com').toObject().baseUrl).to.equal('http://example.com');
    });

    it('allows unsetting baseUrl', () => {
      expect(request.baseUrl('').toObject().baseUrl).to.equal('');
      expect(request.baseUrl(null).toObject().baseUrl).to.equal('');
    });

    it('is immutable', () => {
      const req = request.baseUrl('http://example.com');
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.query', () => {
    it('sets query from a string', () => {
      expect(request.query('foo=bar&example=xyz').toObject().query).to.equal('foo=bar&example=xyz');
    });

    it('sets query from an object', () => {
      expect(request.query({ foo: 'bar', example: 'xyz' }).toObject().query).to.equal('example=xyz&foo=bar');
      expect(request.query({ example: 'xyz', foo: 'bar' }).toObject().query).to.equal('example=xyz&foo=bar');
    });

    it('overwrites previous query', () => {
      expect(request.query({ foo: 'bar', example: 'xyz' }).query({ new: 'query' }).toObject().query).to.equal('new=query');
    });

    it('stringifies given object into query string', () => {
      expect(request.query({}).toObject().query).to.equal('');
      expect(request.query({ foo: 'bar' }).toObject().query).to.equal('foo=bar');
      expect(request.query({ foo: 'bar', baz: 'xyz' }).toObject().query).to.equal('baz=xyz&foo=bar');
      expect(request.query({ foo: [] }).toObject().query).to.equal('');
      expect(request.query({ foo: ['one', 'two'] }).toObject().query).to.equal('foo=one&foo=two');
      expect(request.query({ foo: ['two', 'one'] }).toObject().query).to.equal('foo=two&foo=one');
    });

    it('uses polyfilled URLSearchParams if set', () => {
      function MyURLSearchParams() {}
      MyURLSearchParams.prototype.append = () => {};
      MyURLSearchParams.prototype.toString = () => 'fake query';
      expect(request.polyfills({ URLSearchParams: MyURLSearchParams }).query({ foo: 'bar' }).toObject().query).to.equal('fake query');
    });

    it('is immutable', () => {
      const req = request.query('foo=bar&example=xyz');
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.headers', () => {
    it('sets headers', () => {
      expect(request.headers({ super: 'yes' }).toObject().headers).to.deep.equal({ super: 'yes' });
    });

    it('overwrites existing headers', () => {
      const req = request.headers({ super: 'yes', foo: 'sir' });
      expect(req.headers({ foo: 'bar', fresh: 'sure' }).toObject().headers).to.deep.equal({ foo: 'bar', fresh: 'sure' });
    });

    it('leaves no references', () => {
      const headers = { super: 'yes' };
      const req = request.headers(headers);
      expect(req.toObject().headers).to.not.equal(headers);
      headers.super = 'modified';
      expect(req.toObject().headers.super).to.equal('yes');
    });

    it('converts values to string', () => {
      expect(request.headers({ super: 123 }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('considers keys lowercase', () => {
      expect(request.headers({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('throws on unexpected types', () => {
      expect(() => request.headers({ super: {} })).to.throw('Invalid header value for header \'super\'');
      expect(() => request.headers({ super: [] })).to.throw('Invalid header value for header \'super\'');
      expect(() => request.headers({ super: expect })).to.throw('Invalid header value for header \'super\'');
    });

    it('is immutable', () => {
      const req = request.headers({ super: 123 });
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.amendHeaders', () => {
    it('sets headers even if there are none', () => {
      expect(request.amendHeaders({ super: 'yes' }).toObject().headers).to.deep.equal({ super: 'yes' });
    });

    it('overwrites existing values for keys present in the object', () => {
      const req = request.headers({ super: 'yes', foo: 'sir' });
      expect(req.amendHeaders({ foo: 'bar', fresh: 'sure' }).toObject().headers).to.deep.equal({ super: 'yes', foo: 'bar', fresh: 'sure' });
    });

    it('leaves no references', () => {
      const headers = { super: 'yes' };
      expect(request.amendHeaders(headers).toObject().headers).to.not.equal(headers);
    });

    it('converts values to string', () => {
      expect(request.amendHeaders({ super: 123 }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('considers keys lowercase', () => {
      expect(request.amendHeaders({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
      expect(request.headers({ super: 'foo' }).amendHeaders({ SUPER: '123' }).toObject().headers).to.deep.equal({ super: '123' });
    });

    it('throws on unexpected types', () => {
      expect(() => request.amendHeaders({ super: {} })).to.throw('Invalid header value for header \'super\'');
      expect(() => request.amendHeaders({ super: [] })).to.throw('Invalid header value for header \'super\'');
      expect(() => request.amendHeaders({ super: expect })).to.throw('Invalid header value for header \'super\'');
    });

    it('is immutable', () => {
      const req = request.amendHeaders({ super: 123 });
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.unsetHeader', () => {
    it('accepts non-existent header', () => {
      expect(request.headers({}).unsetHeader('foo').toObject().headers).to.deep.equal({});
      expect(request.headers({ bar: 'one' }).unsetHeader('foo').toObject().headers).to.deep.equal({ bar: 'one' });
    });

    it('unsets header', () => {
      expect(request.headers({ foo: 'bar', fresh: 'sure' }).unsetHeader('foo').toObject().headers).to.deep.equal({ fresh: 'sure' });
    });

    it('considers keys lowercase', () => {
      expect(request.headers({ super: 'foo' }).unsetHeader('SUPER').toObject().headers).to.deep.equal({});
    });

    it('is immutable', () => {
      const req = request.unsetHeader('foo');
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.body', () => {
    it('sets body', () => {
      expect(request.body('holla').toObject().body).to.equal('holla');
    });

    it('converts values to string', () => {
      expect(request.body(123).toObject().body).to.equal('123');
    });

    it('throws on unexpected types', () => {
      expect(() => request.body({})).to.throw('Unexpected type for request body');
      expect(() => request.body([])).to.throw('Unexpected type for request body');
      expect(() => request.body(expect)).to.throw('Unexpected type for request body');
    });

    it('is immutable', () => {
      const req = request.body('holla');
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.json', () => {
    it('sets request body to encoded JSON', () => {
      expect(request.json('holla').toObject().body).to.equal('"holla"');
      expect(request.json(null).toObject().body).to.equal('null');
      expect(request.json([]).toObject().body).to.equal('[]');
      expect(request.json({ hey: 'hi' }).toObject().body).to.equal('{"hey":"hi"}');
    });

    it('sets content-type header to application/json', () => {
      expect(request.json('holla').toObject().headers['content-type']).to.equal('application/json');
    });

    it('is immutable', () => {
      const req = request.json('holla');
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.urlencoded', () => {
    it('sets request body to urlencoded data', () => {
      expect(request.urlencoded({ hey: 'hi' }).toObject().body).to.equal('hey=hi');
    });

    it('sets content-type header to application/x-www-form-urlencoded', () => {
      expect(request.urlencoded('holla').toObject().headers['content-type']).to.equal('application/x-www-form-urlencoded');
    });

    it('uses polyfilled URLSearchParams if set', () => {
      function MyURLSearchParams() {}
      MyURLSearchParams.prototype.append = () => {};
      MyURLSearchParams.prototype.toString = () => 'fake query';
      expect(request.polyfills({ URLSearchParams: MyURLSearchParams }).urlencoded({ hey: 'hi' }).toObject().body).to.equal('fake query');
    });

    it('is immutable', () => {
      const req = request.urlencoded({ hey: 'hi' });
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.timeout', () => {
    it('sets timeout', () => {
      expect(request.timeout(null).toObject().timeout).to.equal(null);
      expect(request.timeout(0).toObject().timeout).to.equal(null);
      expect(request.timeout(99).toObject().timeout).to.equal(99);
    });

    it('throws on unexpected type', () => {
      expect(() => request.timeout({})).to.throw('Expected a number for timeout');
      expect(() => request.timeout([])).to.throw('Expected a number for timeout');
      expect(() => request.timeout(expect)).to.throw('Expected a number for timeout');
    });

    it('is immutable', () => {
      const req = request.timeout(99);
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.unsetTimeout', () => {
    it('unsets timeout', () => {
      expect(request.timeout(99).unsetTimeout().toObject().timeout).to.equal(null);
    });

    it('is immutable', () => {
      const req = request.unsetTimeout();
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.send', () => {
    it('exists (see requests.spec.js for more tests)', () => {
      expect(request.send).to.be.ok;
    });
  });

  describe('.setResponseTransformers', () => {
    const fn = () => {};

    it('sets response transformers', () => {
      expect(request.setResponseTransformers([]).toObject().responseTransformers).to.deep.equal([]);
      expect(request.setResponseTransformers([fn]).toObject().responseTransformers).to.deep.equal([fn]);
      expect(request.setResponseTransformers([fn, fn]).toObject().responseTransformers).to.deep.equal([fn, fn]);
    });

    it('throws on unexpected type', () => {
      expect(() => request.setResponseTransformers({})).to.throw('Expected an array of response transformers');
      expect(() => request.setResponseTransformers(expect)).to.throw('Expected an array of response transformers');
      expect(() => request.setResponseTransformers([null])).to.throw('One or more response transformer is not a function');
      expect(() => request.setResponseTransformers([fn, null])).to.throw('One or more response transformer is not a function');
    });

    it('leaves no reference to the array', () => {
      const array = [fn];
      const req = request.setResponseTransformers(array);
      expect(req.toObject().responseTransformers).to.not.equal(array);
      array.splice(0, 1);
      expect(req.toObject().responseTransformers).to.deep.equal([fn]);
    });

    it('is immutable', () => {
      const req = request.setResponseTransformers([]);
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.setAllowedStatusCode', () => {
    const fn = () => {};

    it('sets allowed status code', () => {
      expect(request.setAllowedStatusCode(200).toObject().allowedStatusCode).to.equal(200);
      expect(request.setAllowedStatusCode(/asd/).toObject().allowedStatusCode).to.deep.equal(/asd/);
      expect(request.setAllowedStatusCode(fn).toObject().allowedStatusCode).to.equal(fn);
    });

    it('throws on unexpected type', () => {
      expect(() => request.setAllowedStatusCode('foo')).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
      expect(() => request.setAllowedStatusCode({})).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
      expect(() => request.setAllowedStatusCode([])).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
      expect(() => request.setAllowedStatusCode(null)).to.throw('Expected a number, a regex or a function in setAllowedStatusCode');
    });

    it('is immutable', () => {
      const req = request.setAllowedStatusCode(200);
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.polyfills', () => {
    const dummy = () => {};

    it('sets Promise', () => {
      expect(request.polyfills({ Promise: dummy }).toObject().polyfills.Promise).to.equal(dummy);
    });

    it('sets URLSearchParams', () => {
      expect(request.polyfills({ URLSearchParams: dummy }).toObject().polyfills.URLSearchParams).to.equal(dummy);
    });

    it('leaves no reference to the object', () => {
      const object = { Promise: dummy };
      expect(request.polyfills(object).toObject().polyfills).to.not.equal(object);
    });

    it('allows clearing all', () => {
      expect(request.polyfills({ Promise: dummy }).polyfills(null).toObject().polyfills).to.deep.equal({});
    });

    it('is immutable', () => {
      const req = request.polyfills({ Promise: dummy });
      expect(req).to.not.equal(request);
      expect(req).to.be.instanceOf(ImmutableAjaxRequest);
    });
  });

  describe('.toObject', () => {
    it('returns a no-reference copy of request config', () => {
      const object = request.toObject();
      expect(object).to.deep.equal(request._config);
      expect(object).to.not.equal(request._config);
      expect(object.headers).to.not.equal(request._config.headers);
      expect(object.responseTransformers).to.not.equal(request._config.responseTransformers);
      expect(object.polyfills).to.not.equal(request._config.polyfills);
    });

    it('has alias .config', () => {
      const object = request.toObject();
      expect(object).to.deep.equal(request._config);
      expect(object).to.not.equal(request._config);
      expect(object.headers).to.not.equal(request._config.headers);
      expect(object.responseTransformers).to.not.equal(request._config.responseTransformers);
      expect(object.polyfills).to.not.equal(request._config.polyfills);
    });

    it('has alias .debug', () => {
      const object = request.toObject();
      expect(object).to.deep.equal(request._config);
      expect(object).to.not.equal(request._config);
      expect(object.headers).to.not.equal(request._config.headers);
      expect(object.responseTransformers).to.not.equal(request._config.responseTransformers);
      expect(object.polyfills).to.not.equal(request._config.polyfills);
    });
  });
});
