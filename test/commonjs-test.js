// This test is for ensuring that those using browserify will be able to require the module

const path = require('path');
const rootPath = path.join(__dirname, '..');

const packageJson = require(path.join(rootPath, 'package.json'));
const supremeAjax = require(path.join(rootPath, packageJson.main));

if (supremeAjax && supremeAjax.constructor && supremeAjax.constructor.name === 'SupremeAjaxRequest') {
  process.exit(0);
} else {
  process.exit(1);
}
