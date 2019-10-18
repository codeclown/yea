describe('utils', function () {
  describe('.assign', function () {
    it('emulates Object.assign', function () {
      expect(yea.utils.assign({})).to.deep.equal({});
      expect(yea.utils.assign({}, {})).to.deep.equal({});
      expect(yea.utils.assign({ foo: 'bar' }, { yes: 'asd' })).to.deep.equal({ foo: 'bar', yes: 'asd' });
      expect(yea.utils.assign({ foo: 'bar' }, { foo: 'asd' })).to.deep.equal({ foo: 'asd' });
    });

    it('mutates first argument, like Object.assign', function () {
      var obj = {};
      var assigned = yea.utils.assign(obj, { simple: 'yes' });
      expect(assigned).to.equal(obj);
      expect(obj).to.deep.equal({ simple: 'yes' });
    });
  });

  describe('.toQueryString', function () {
    // Goal is to follow querystring.stringify behaviour:
    // @see https://nodejs.org/api/querystring.html#querystring_querystring_stringify_obj_sep_eq_options
    // Also useful is the tests in widely popular package query-string:
    // @see https://github.com/sindresorhus/query-string/blob/de0536a7be7029a93936d2610f1b08606ac93ce7/test/stringify.js

    it('stringifies an object', function () {
      expect(yea.utils.toQueryString({})).to.equal('');
      expect(yea.utils.toQueryString({ foo: 'bar' })).to.equal('foo=bar');
      expect(yea.utils.toQueryString({ foo: 'bar', baz: 'xyz' })).to.equal('foo=bar&baz=xyz');
    });

    it('encodes keys and values', function () {
      expect(yea.utils.toQueryString({ foo: 'bar xyz' })).to.equal('foo=bar%20xyz');
      expect(yea.utils.toQueryString({ foo: 'bar&xyz' })).to.equal('foo=bar%26xyz');
      expect(yea.utils.toQueryString({ foo: 'bar\'xyz' })).to.equal('foo=bar\'xyz');
      expect(yea.utils.toQueryString({ 'bar xyz': 'bar' })).to.equal('bar%20xyz=bar');
      expect(yea.utils.toQueryString({ 'bar&xyz': 'bar' })).to.equal('bar%26xyz=bar');
      expect(yea.utils.toQueryString({ 'bar\'xyz': 'bar' })).to.equal('bar\'xyz=bar');
    });

    it('stringifies array values', function () {
      expect(yea.utils.toQueryString({ foo: [] })).to.equal('');
      expect(yea.utils.toQueryString({ foo: ['one', 'two'] })).to.equal('foo=one&foo=two');
      expect(yea.utils.toQueryString({ foo: ['two', 'one'] })).to.equal('foo=two&foo=one');
    });

    it('stringifies objects as values', function () {
      expect(yea.utils.toQueryString({ foo: {} })).to.equal('foo=%5Bobject%20Object%5D');
      expect(yea.utils.toQueryString({ foo: { bar: 'xyz' } })).to.equal('foo=%5Bobject%20Object%5D');
    });

    it('regards undefined values as missing', function () {
      expect(yea.utils.toQueryString({ foo: undefined })).to.equal('');
      expect(yea.utils.toQueryString({ foo: undefined, bar: 'xyz' })).to.equal('bar=xyz');
      expect(yea.utils.toQueryString({ foo: [undefined] })).to.equal('');
      expect(yea.utils.toQueryString({ foo: ['one', undefined, 'three'] })).to.equal('foo=one&foo=three');
    });

    it('stringifies null values as ', function () {
      expect(yea.utils.toQueryString({ foo: null })).to.equal('foo');
      expect(yea.utils.toQueryString({ foo: null, bar: 'xyz' })).to.equal('foo&bar=xyz');
      expect(yea.utils.toQueryString({ foo: [null] })).to.equal('foo');
      expect(yea.utils.toQueryString({ foo: ['one', null, 'three'] })).to.equal('foo=one&foo&foo=three');
    });
  });

  describe('.createUrl', function () {
    it('creates URL from baseUrl, path and query', function () {
      expect(yea.utils.createUrl('', 'accounts')).to.equal('accounts');
      expect(yea.utils.createUrl('', '/accounts')).to.equal('/accounts');
      expect(yea.utils.createUrl('', 'https://example.com')).to.equal('https://example.com');
      expect(yea.utils.createUrl('https://example.com', 'accounts')).to.equal('https://example.com/accounts');
      expect(yea.utils.createUrl('https://example.com/', 'accounts')).to.equal('https://example.com/accounts');
      expect(yea.utils.createUrl('https://example.com', '/accounts')).to.equal('https://example.com/accounts');
      expect(yea.utils.createUrl('https://example.com/', '/accounts')).to.equal('https://example.com/accounts');
      expect(yea.utils.createUrl('https://example.com/nested', 'accounts')).to.equal('https://example.com/nested/accounts');
      expect(yea.utils.createUrl('https://example.com/nested', '/accounts')).to.equal('https://example.com/nested/accounts');
      expect(yea.utils.createUrl('https://example.com/nested/', 'accounts')).to.equal('https://example.com/nested/accounts');
      expect(yea.utils.createUrl('https://example.com/nested/foo', 'accounts')).to.equal('https://example.com/nested/foo/accounts');
      expect(yea.utils.createUrl('https://example.com', '')).to.equal('https://example.com');
      expect(yea.utils.createUrl('https://example.com', '', 'foo=bar')).to.equal('https://example.com?foo=bar');
      expect(yea.utils.createUrl('https://example.com', 'accounts', 'foo=bar')).to.equal('https://example.com/accounts?foo=bar');
      expect(yea.utils.createUrl('', 'accounts', 'foo=bar')).to.equal('accounts?foo=bar');
    });
  });

  describe('.parsePropPath', function () {
    it('parses path', function () {
      // Simple dot notation
      expect(yea.utils.parsePropPath('data')).to.deep.equal(['data']);
      expect(yea.utils.parsePropPath('headers')).to.deep.equal(['headers']);
      expect(yea.utils.parsePropPath('data.accounts')).to.deep.equal(['data', 'accounts']);
      // Array indices
      expect(yea.utils.parsePropPath('data.accounts[0]')).to.deep.equal(['data', 'accounts', '0']);
      expect(yea.utils.parsePropPath('data.accounts[1]')).to.deep.equal(['data', 'accounts', '1']);
    });
  });

  describe('.applyPropPath', function () {
    it('picks requested value from object', function () {
      var response = {
        headers: {
          'content-type': 'application/json'
        },
        data: {
          accounts: [
            { name: 'Account 1' },
            { name: 'Account 2' }
          ]
        }
      };
      expect(yea.utils.applyPropPath(response, [])).to.equal(response);
      expect(yea.utils.applyPropPath(response, ['headers'])).to.equal(response.headers);
      expect(yea.utils.applyPropPath(response, ['data'])).to.equal(response.data);
      expect(yea.utils.applyPropPath(response, ['data', 'accounts'])).to.equal(response.data.accounts);
      expect(yea.utils.applyPropPath(response, ['data', 'accounts', '0'])).to.equal(response.data.accounts['0']);
      expect(yea.utils.applyPropPath(response, ['data', 'accounts', '1'])).to.equal(response.data.accounts['1']);
      expect(yea.utils.applyPropPath(response, ['headers', 'content-type'])).to.equal(response.headers['content-type']);
    });
  });
});
