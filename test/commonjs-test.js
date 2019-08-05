// This test is for ensuring that those using browserify will be able to require the module

const assert = require('assert');
const path = require('path');
const rootPath = path.join(__dirname, '..');

const packageJson = require(path.join(rootPath, 'package.json'));
const yea = require(path.join(rootPath, packageJson.main));

try {
  assert(yea);
  assert(yea.constructor);
  assert.equal(yea.constructor.name, 'YeaAjaxRequest');
} catch (error) {
  console.error('CommonJS test file errored!');
  console.error('');
  console.error(error.stack);
}
