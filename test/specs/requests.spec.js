describe('Requests', function () {
  this.timeout(8000);

  it('makes a GET request', function () {
    return yea
      .method('get')
      .url('/simple-get')
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('hello');
      });
  });

  it('defaults to GET', function () {
    return yea
      .url('/simple-get')
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('hello');
      });
  });

  it('sends request headers', function () {
    return yea
      .url('/dump-headers')
      .headers({ 'x-random': 'yes' })
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.contain('x-random: yes');
      });
  });

  it('returns response headers', function () {
    return yea
      .method('get')
      .url('/dummy-headers')
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.headers).to.be.a('object');
        expect(response.headers['x-dummy']).to.equal('definitely');
      });
  });

  // it is almost impossible to send any other than lowercase header names from our
  // node-based test server, so we can't really test this property at this time
  // see: https://github.com/nodejs/node/issues/3591
  it('lowercases incoming response header names');

  it('uses baseUrl if set', function () {
    return yea
      .method('get')
      .baseUrl('http://localhost:9876/nested')
      .url('simple-get')
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('nested hello');
      });
  });

  it('includes query string if set', function () {
    return yea
      .url('/dump-query')
      .query({ hello: 'yes', looking: 'me' })
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.contain('hello: yes\nlooking: me');
      });
  });

  it('overrides query string via .query', function () {
    return yea
      .url('/dump-query?first=here')
      .query({ hello: 'yes' })
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.contain('hello: yes');
      });
  });

  it('overrides query string via .url', function () {
    return yea
      .query({ hello: 'yes' })
      .url('/dump-query?first=here')
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.contain('first: here');
      });
  });

  it('sends body', function () {
    return yea
      .method('post')
      .url('/dump-request-body')
      .body('here i am')
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('here i am');
      });
  });

  it('sends body via .send', function () {
    return yea
      .method('post')
      .url('/dump-request-body')
      .send('here i am')
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('here i am');
      });
  });

  it('sends urlencoded', function () {
    return yea
      .method('post')
      .url('/validate-urlencoded-request')
      .urlencoded({ hello: 'there', whats: 'up' })
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('PASS');
      });
  });

  it('sends urlencoded via .sendUrlencoded', function () {
    return yea
      .method('post')
      .url('/validate-urlencoded-request')
      .sendUrlencoded({ hello: 'there', whats: 'up' })
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('PASS');
      });
  });

  it('sends json', function () {
    return yea
      .method('post')
      .url('/validate-json-request')
      .json({ lover: 'leaver' })
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('{"lover":"leaver"}');
      });
  });

  it('sends json via .sendJson', function () {
    return yea
      .method('post')
      .url('/validate-json-request')
      .sendJson({ lover: 'leaver' })
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('{"lover":"leaver"}');
      });
  });

  it('decodes incoming json', function () {
    return yea
      .method('get')
      .url('/json-payload')
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.data).to.be.a('object');
        expect(response.data).to.deep.equal({
          taker: 'believer'
        });
      });
  });

  it('does not decode incoming json without transformer', function () {
    return yea
      .method('get')
      .url('/json-payload')
      .setResponseTransformers([])
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('{"taker":"believer"}');
      });
  });

  it('throws on 404', function () {
    var error;
    return yea
      .method('get')
      .url('/this-shall-not-exist')
      .send()
      .catch(function (_error) {
        error = _error;
      })
      .then(function () {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed with status 404');
        expect(error.response).to.be.a('object');
        expect(error.response.status).to.equal(404);
      });
  });

  it('validates status using integer', function () {
    var error;
    var req = yea.setAllowedStatusCode(202);
    return req
      .url('/specific-status?give=200')
      .send()
      .catch(function (_error) {
        error = _error;
      })
      .then(function () {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed with status 200');
        return req.url('/specific-status?give=202').send();
      });
  });

  it('validates status using regex', function () {
    var error;
    var req = yea.setAllowedStatusCode(/^300$/);
    return req
      .url('/specific-status?give=200')
      .send()
      .catch(function (_error) {
        error = _error;
      })
      .then(function () {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed with status 200');
        return req.url('/specific-status?give=300').send();
      });
  });

  it('validates status using function', function () {
    var error;
    var req = yea.setAllowedStatusCode(function (status) {
      return status === 201;
    });
    return req
      .url('/specific-status?give=200')
      .send()
      .catch(function (_error) {
        error = _error;
      })
      .then(function () {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed with status 200');
        return req.url('/specific-status?give=201').send();
      });
  });

  it('uses custom response transformers', function () {
    var transformers = [
      // transformer 1
      function (response) {
        return yea.utils.assign({}, response, {
          body: response.body + '-1'
        });
      },
      // transformer 2
      function (response) {
        return yea.utils.assign({}, response, {
          body: response.body + '-2'
        });
      }
    ];
    return yea
      .method('get')
      .url('/simple-get')
      .setResponseTransformers(transformers)
      .send()
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('string');
        expect(response.body).to.equal('hello-1-2');
      });
  });

  it('supports specifying a timeout', function () {
    var error;
    var req = yea.timeout(1000);
    return req
      .url('/specific-timeout?wait=2000')
      .send()
      .catch(function (_error) {
        error = _error;
      })
      .then(function () {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Request failed due to timeout (1000ms)');
        return req.url('/specific-timeout?wait=0').send();
      });
  }).slow(3000);

  it('supports clearing timeout', function () {
    return yea
      .timeout(100)
      .unsetTimeout()
      .url('/specific-timeout?wait=200')
      .send();
  }).slow(500);

  it('allows setting Promise-implementation', function () {
    function MyPromise () {}

    var promise = yea
      .method('get')
      .url('/simple-get')
      .polyfills({
        Promise: MyPromise
      })
      .send();

    expect(promise).to.be.instanceOf(MyPromise);
  });
});
