describe('Requests', () => {
  it('makes a GET request', () =>
    request
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
    request
      .url('/simple-get')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('hello');
      })
  );

  it('sends request headers', () =>
    request
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
    request
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
    request
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
    request
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
    request
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
    request
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
    request
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
    request
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
    request
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
    request
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
    request
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
    return request
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
    const req = request.setAllowedStatusCode(202);
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
    const req = request.setAllowedStatusCode(/^300$/);
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
    const req = request.setAllowedStatusCode(status => status === 201);
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
    return request
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
    const req = request.timeout(100);
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
    request
      .timeout(100)
      .unsetTimeout()
      .url('/specific-timeout?wait=200')
      .send()
  ).slow(500);

  it('allows setting Promise-implementation', () => {
    class MyPromise extends Promise {}
    const promise = request
      .method('get')
      .url('/simple-get')
      .polyfills({ Promise: MyPromise })
      .send();
    expect(promise).to.be.instanceOf(MyPromise);
    return promise;
  });
});
