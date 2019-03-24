describe('Requests', () => {
  it('makes a GET request', () =>
    supremeAjax
      .method('get')
      .url('/simple-get')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('hello');
      })
  );

  it('defaults to GET', () =>
    supremeAjax
      .url('/simple-get')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('hello');
      })
  );

  it('sends request headers', () =>
    supremeAjax
      .url('/dump-headers')
      .headers({
        'x-random': 'yes'
      })
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.contain('x-random: yes');
      })
  );

  it('returns response headers', () =>
    supremeAjax
      .method('get')
      .url('/dummy-headers')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.headers).to.be.a('object');
        expect(response.headers['x-dummy']).to.equal('definitely');
      })
  );

  it('uses baseUrl if set', () =>
    supremeAjax
      .method('get')
      .baseUrl('http://localhost:9876/nested/foo')
      .url('simple-get')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('nested hello');
      })
  );

  it('uses full URL if set, regardless of base URL', () =>
    supremeAjax
      .method('get')
      .baseUrl('http://localhost:9876/nested/')
      .url('http://localhost:9876/simple-get')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('hello');
      })
  );

  it('includes query string if set', () =>
    supremeAjax
      .url('/dump-query')
      .query({
        hello: 'yes',
        looking: 'me'
      })
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.contain('hello: yes\nlooking: me');
      })
  );

  it('overrides query string via .query', () =>
    supremeAjax
      .url('/dump-query?first=here')
      .query({
        hello: 'yes'
      })
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.contain('hello: yes');
      })
  );

  it('overrides query string via .url', () =>
    supremeAjax
      .query({
        hello: 'yes'
      })
      .url('/dump-query?first=here')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.contain('first: here');
      })
  );

  it('sends urlencoded', () =>
    supremeAjax
      .method('post')
      .url('/validate-urlencoded-request')
      .urlencoded({ hello: 'there', whats: 'up' })
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('PASS');
      })
  );

  it('sends json', () =>
    supremeAjax
      .method('post')
      .url('/validate-json-request')
      .json({ lover: 'leaver' })
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('{"lover":"leaver"}');
      })
  );

  it('decodes incoming json', () =>
    supremeAjax
      .method('get')
      .url('/json-payload')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.data).to.be.a('object');
        expect(response.data).to.deep.equal({ taker: 'believer' });
      })
  );

  it('does not decode incoming json without transformer', () =>
    supremeAjax
      .method('get')
      .url('/json-payload')
      .setResponseTransformers([])
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('{"taker":"believer"}');
      })
  );

  it('throws on 404', () => {
    let error;
    return supremeAjax
      .method('get')
      .url('/this-shall-not-exist')
      .send()
      .catch(_error => {
        error = _error;
      })
      .then(() => {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed with status 404');
        expect(error.response).to.be.a('object');
        expect(error.response.status).to.equal(404);
      })
  });

  it('validates status using integer', () => {
    let error;
    const req = supremeAjax.setAllowedStatusCode(202);
    return req
      .url('/specific-status?give=200')
      .send()
      .catch(_error => {
        error = _error;
      })
      .then(() => {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed with status 200');

        return req
          .url('/specific-status?give=202')
          .send();
      })
  });

  it('validates status using regex', () => {
    let error;
    const req = supremeAjax.setAllowedStatusCode(/^300$/);
    return req
      .url('/specific-status?give=200')
      .send()
      .catch(_error => {
        error = _error;
      })
      .then(() => {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed with status 200');

        return req
          .url('/specific-status?give=300')
          .send();
      })
  });

  it('validates status using function', () => {
    let error;
    const req = supremeAjax.setAllowedStatusCode(status => status === 201);
    return req
      .url('/specific-status?give=200')
      .send()
      .catch(_error => {
        error = _error;
      })
      .then(() => {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed with status 200');

        return req
          .url('/specific-status?give=201')
          .send();
      })
  });

  it('uses custom response transformers', () => {
    const transformers = [
      response => Object.assign({}, response, { body: response.body + '-1' }),
      response => Object.assign({}, response, { body: response.body + '-2' })
    ];
    return supremeAjax
      .method('get')
      .url('/simple-get')
      .setResponseTransformers(transformers)
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('hello-1-2');
      });
  });

  it('supports specifying a timeout', () => {
    let error;
    const req = supremeAjax.timeout(100);
    return req
      .url('/specific-timeout?wait=2000')
      .send()
      .catch(_error => {
        error = _error;
      })
      .then(() => {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed due to timeout (100ms)');

        return req
          .url('/specific-timeout?wait=0')
          .send();
      })
  }).timeout(3000).slow(3000);

  it('supports clearing timeout', () =>
    supremeAjax
      .timeout(100)
      .unsetTimeout()
      .url('/specific-timeout?wait=200')
      .send()
  ).slow(500);

  it('allows setting Promise-implementation', () => {
    class MyPromise extends Promise {}
    const promise = supremeAjax
      .method('get')
      .url('/simple-get')
      .polyfills({ Promise: MyPromise })
      .send();
    expect(promise).to.be.instanceOf(MyPromise);
    return promise;
  });
});
