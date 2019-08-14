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
    it('stringifies given object into query string', function () {
      expect(yea.utils.toQueryString({})).to.equal('');
      expect(yea.utils.toQueryString({ foo: 'bar' })).to.equal('foo=bar');
      expect(yea.utils.toQueryString({ foo: 'bar', baz: 'xyz' })).to.equal('foo=bar&baz=xyz');
      expect(yea.utils.toQueryString({ foo: [] })).to.equal('');
      expect(yea.utils.toQueryString({ foo: ['one', 'two'] })).to.equal('foo=one&foo=two');
      expect(yea.utils.toQueryString({ foo: ['two', 'one'] })).to.equal('foo=two&foo=one');
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
});
