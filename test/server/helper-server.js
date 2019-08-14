const bodyParser = require('body-parser');
const express = require('express');

// This server provides useful routes for testing various AJAX requests

const app = express();

// Parse all request bodies into string, no decoding
app.use(bodyParser.text({ type: '*/*' }));

app.get('/simple-get', (req, res, next) => res.send('hello'));
app.get('/nested/simple-get', (req, res, next) => res.send('nested hello'));
app.post('/dump-request-body', (req, res, next) => res.send(req.body));
app.get('/dump-headers', (req, res, next) => res.send(
  Object.keys(req.headers).sort().map(name => `${name}: ${req.headers[name]}`).join('\n')
));
app.get('/dump-query', (req, res, next) => res.send(
  Object.keys(req.query).sort().map(key => `${key}: ${req.query[key]}`).join('\n')
));
app.post('/validate-urlencoded-request', (req, res, next) => {
  if (req.headers['content-type'] !== 'application/x-www-form-urlencoded') {
    res.status(400).send('FAIL (header)');
  } else if (req.body !== 'hello=there&whats=up') {
    res.status(400).send('FAIL (body)');
  } else {
    res.set('content-type', 'text/plain').send('PASS');
  }
});
app.post('/validate-json-request', (req, res, next) => {
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
app.get('/dummy-headers', (req, res, next) => res.set({ 'x-dummy': 'definitely' }).send(''));
app.get('/json-payload', (req, res, next) => res.set('content-type', 'application/json').send('{"taker":"believer"}'));
app.get('/specific-status', (req, res, next) => res.status(req.query.give).send(''));
app.get('/specific-timeout', (req, res, next) => setTimeout(() => res.send('made it'), req.query.wait));

module.exports = app;
