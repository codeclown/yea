describe('ImmutableAjaxRequest', () => {
  describe('ImmutableAjaxRequest', () => {
    it('has defaults', () => {
      console.log(request.toObject());
      expect(request.toObject()).to.deep.equal({
        method: 'GET',
        url: '',
        body: '',
        headers: {},
        responseTransformers: []
      });
    });

    it('defaults to global dependencies');
  });

  describe('.get', () => {});
  describe('.post', () => {});

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
    });
  });

  describe('.url', () => {
    it('sets url', () => {
      expect(request.url('http://example.com').toObject().url).to.equal('http://example.com');
    });

    it('is immutable', () => {
      const req = request.url('http://example.com');
      expect(req).to.not.equal(request);
    });
  });

  describe('.baseUrl', () => {});
  describe('.query', () => {});

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
      expect(request.headers(headers).toObject().headers).to.not.equal(headers);
    });

    it('converts values to string', () => {
      expect(request.headers({ super: 123 }).toObject().headers).to.not.equal({ super: '123' });
    });

    it('throws on unexpected types', () => {
      expect(() => request.headers({ super: {} })).to.throw('Invalid header value for header \'super\'');
      expect(() => request.headers({ super: [] })).to.throw('Invalid header value for header \'super\'');
      expect(() => request.headers({ super: expect })).to.throw('Invalid header value for header \'super\'');
    });

    it('is immutable', () => {
      const req = request.headers({ super: 123 });
      expect(req).to.not.equal(request);
    });
  });

  describe('.amendHeaders', () => {});
  describe('.unsetHeader', () => {});
  describe('.body', () => {});
  describe('.json', () => {});
  describe('.urlencoded', () => {});
  describe('.timeout', () => {});
  describe('.unsetTimeout', () => {});

  describe('.send', () => {
    // See requests.spec.js for more
    it('exists', () => {
      expect(request.send).to.be.ok;
    });
  });

  describe('.setResponseTransformers', () => {});
  describe('.setAllowedStatusCode', () => {});
  describe('.polyfills', () => {});

  describe('.toObject', () => {
    it('returns a no-reference copy of request config', () => {
      const object = request.toObject();
      expect(object).to.deep.equal(request.config);
      expect(object).to.not.equal(request.config);
      expect(object.headers).to.not.equal(request.config.headers);
    });
  });
});
