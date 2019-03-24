const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const helperServer = require('./helper-server');

const app = express();
app.use(helperServer);

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'mocha-server.html')));
app.get('/mocha.css', (req, res, next) => res.sendFile(path.join(__dirname, '../node_modules/mocha/mocha.css')));
app.get('/mocha.js', (req, res, next) => res.sendFile(path.join(__dirname, '../node_modules/mocha/mocha.js')));
app.get('/chai.js', (req, res, next) => res.sendFile(path.join(__dirname, '../node_modules/chai/chai.js')));
app.get('/supreme-ajax.min.js', (req, res, next) => res.sendFile(path.join(__dirname, '../build/supreme-ajax.min.js')));
app.use('/specs', express.static(path.join(__dirname, 'specs')));

app.listen(9876, () => {
  console.log('Test server is running!');
  console.log('Open http://localhost:9876/ in your browser');
});
