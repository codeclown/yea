var express = require('express');
var path = require('path');
var helperServer = require('./helper-server');

// This file starts a HTTP server which serves the Mocha HTML runner
// See also: mocha.html

var app = express();
app.use(helperServer);

app.get('/', function (req, res) {
  return res.sendFile(path.join(__dirname, 'mocha.html'));
});
app.get('/mocha.css', function (req, res) {
  return res.sendFile(path.join(__dirname, '../../node_modules/mocha/mocha.css'));
});
app.get('/mocha.js', function (req, res) {
  return res.sendFile(path.join(__dirname, '../../node_modules/mocha/mocha.js'));
});
app.get('/chai.js', function (req, res) {
  return res.sendFile(path.join(__dirname, '../../node_modules/chai/chai.js'));
});
app.get('/yea.min.js', function (req, res) {
  return res.sendFile(path.join(__dirname, '../../build/yea.min.js'));
});
app.use('/specs', express.static(path.join(__dirname, '../specs')));
app.listen(9876, function () {
  /* eslint-disable no-console */
  console.log('Test server is running!');
  console.log('Open http://localhost:9876/ in your browser');
});
