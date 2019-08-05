describe('Requests', () => {
  it('makes a GET request', () =>
    yea
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
    yea
      .url('/simple-get')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('hello');
      })
  );

  it('sends request headers', () =>
    yea
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
    yea
      .method('get')
      .url('/dummy-headers')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.headers).to.be.a('object');
        expect(response.headers['x-dummy']).to.equal('definitely');
      })
  );

  // it is almost impossible to send any other than lowercase header names from our
  // node-based test server, so we can't really test this property at this time
  // see: https://github.com/nodejs/node/issues/3591
  it('lowercases incoming response header names');

  it('uses baseUrl if set', () =>
    yea
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
    yea
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
    yea
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
    yea
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
    yea
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

  it('sends body', () =>
    yea
      .method('post')
      .url('/dump-request-body')
      .body('here i am')
      .send()
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('here i am');
      })
  );

  it('sends body via .send', () =>
    yea
      .method('post')
      .url('/dump-request-body')
      .send('here i am')
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('here i am');
      })
  );

  it('sends urlencoded', () =>
    yea
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

  it('sends urlencoded via .sendUrlencoded', () =>
    yea
      .method('post')
      .url('/validate-urlencoded-request')
      .sendUrlencoded({ hello: 'there', whats: 'up' })
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('PASS');
      })
  );

  it('sends json', () =>
    yea
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

  it('sends json via .sendJson', () =>
    yea
      .method('post')
      .url('/validate-json-request')
      .sendJson({ lover: 'leaver' })
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('{"lover":"leaver"}');
      })
  );

  it('decodes incoming json', () =>
    yea
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
    yea
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
    return yea
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
    const req = yea.setAllowedStatusCode(202);
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
    const req = yea.setAllowedStatusCode(/^300$/);
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
    const req = yea.setAllowedStatusCode(status => status === 201);
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
    return yea
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
    const req = yea.timeout(100);
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
    yea
      .timeout(100)
      .unsetTimeout()
      .url('/specific-timeout?wait=200')
      .send()
  ).slow(500);

  it('allows setting Promise-implementation', () => {
    class MyPromise extends Promise {}
    const promise = yea
      .method('get')
      .url('/simple-get')
      .polyfills({ Promise: MyPromise })
      .send();
    expect(promise).to.be.instanceOf(MyPromise);
    return promise;
  });
});
