var bodyParser = require('body-parser');
var express = require('express');

// This server provides useful routes for testing various AJAX requests

var app = express();

// Parse all request bodies into string, no decoding
app.use(bodyParser.text({ type: '*/*' }));

app.get('/simple-get', function (req, res) {
  return res.send('hello');
});
app.put('/simple-put', function (req, res) {
  return res.send('golf');
});
app.delete('/simple-delete', function (req, res) {
  return res.send('begone');
});
app.get('/nested/simple-get', function (req, res) {
  return res.send('nested hello');
});
app.post('/dump-request-body', function (req, res) {
  return res.send(req.body);
});
app.get('/dump-headers', function (req, res) {
  return res.send(Object.keys(req.headers).sort().map(function (name) {
    return "".concat(name, ": ").concat(req.headers[name]);
  }).join('\n'));
});
app.get('/dump-url/*', function (req, res) {
  return res.send(req.originalUrl);
});
app.get('/dump-query', function (req, res) {
  return res.send(Object.keys(req.query).sort().map(function (key) {
    return "".concat(key, ": ").concat(req.query[key]);
  }).join('\n'));
});
app.post('/validate-urlencoded-request', function (req, res) {
  if (req.headers['content-type'] !== 'application/x-www-form-urlencoded') {
    res.status(400).send('FAIL (header)');
  } else if (req.body !== 'hello=there&whats=up') {
    res.status(400).send('FAIL (body)');
  } else {
    res.set('content-type', 'text/plain').send('PASS');
  }
});
app.post('/validate-json-request', function (req, res) {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send('FAIL (header)');
  } else {
    try {
      res.set('content-type', 'text/plain').send(JSON.parse(req.body));
    } catch (exception) {
      res.status(400).send('FAIL (body)');
    }
  }
});
app.get('/dummy-headers', function (req, res) {
  return res.set({
    'x-dummy': 'definitely'
  }).send('');
});
app.get('/json-payload', function (req, res) {
  return res.set('content-type', 'application/json').send('{"taker":"believer"}');
});
app.get('/json-payload-fail', function (req, res) {
  return res.status(400).set('content-type', 'application/json').send('{"taker":"believer"}');
});
app.get('/specific-status', function (req, res) {
  return res.status(req.query.give).send('');
});
app.get('/specific-timeout', function (req, res) {
  return setTimeout(function () {
    return res.send('made it');
  }, req.query.wait);
});

module.exports = app;
