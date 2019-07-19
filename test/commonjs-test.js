// This test is for ensuring that those using browserify will be able to require the module

const assert = require('assert');
const path = require('path');
const rootPath = path.join(__dirname, '..');

const packageJson = require(path.join(rootPath, 'package.json'));
const supremeAjax = require(path.join(rootPath, packageJson.main));

try {
  assert(supremeAjax);
  assert(supremeAjax.constructor);
  assert.equal(supremeAjax.constructor.name, 'SupremeAjaxRequest');
} catch (error) {
  console.error('CommonJS test file errored!');
  console.error('');
  console.error(error.stack);
}
