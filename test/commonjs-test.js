// This test is for ensuring that those using browserify will be able to require the module

var assert = require('assert');
var path = require('path');
var rootPath = path.join(__dirname, '..');

var packageJson = require(path.join(rootPath, 'package.json'));
var yea = require(path.join(rootPath, packageJson.main));

try {
  assert(yea);
  assert(yea.constructor);
  assert.equal(yea.constructor.name, 'YeaAjaxRequest');
} catch (error) {
  /* eslint-disable no-console */
  console.error('CommonJS test file errored!');
  console.error('');
  console.error(error.stack);
  process.exit(1);
}
