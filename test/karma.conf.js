const helperServer = require('./server/helper-server');

module.exports = function(config) {
  // Karma config is some of the most horrifying things I've seen... anyway, here goes

  const configuration = {
    basePath: '../',
    files: [
      'node_modules/es6-promise/dist/es6-promise.auto.min.js',
      'test/specs/*.js',
      'build/yea.js'
    ],
    client: {
      captureConsole: true
    },
    exclude: [],
    frameworks: ['mocha', 'chai'],
    preprocessors: {},
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: false,
    concurrency: Infinity,

    // Locally run on Chrome headless
    browsers: ['ChromeHeadless'],

    // Run helper server as a middleware to the karma web server
    middleware: ['helper-server'],
    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-mocha',
      {'middleware:helper-server': ['factory', function(config) {
        return helperServer;
      }]}
    ]
  };

  if (process.env.TRAVIS || process.env.SAUCE_USERNAME) {
    // configuration.reporters.push('saucelabs');
    configuration.plugins.push('karma-sauce-launcher');
    configuration.sauceLabs = {
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || Date.now().toString(),
      recordScreenshots: false,
      recordVideo: false,
      startConnect: true,
      connectLocationForSERelay: 'ondemand.eu-central-1.saucelabs.com',
      // See: https://github.com/karma-runner/karma-sauce-launcher/issues/162
      connectPortForSERelay:'80/wd/hub',
      connectOptions: {
        '-x': 'https://eu-central-1.saucelabs.com/rest/v1'
      }
    };
    configuration.customLaunchers = {
      sl_chrome: { base: 'SauceLabs', browserName: 'chrome', platform: 'Windows 7', version: '61' },
      sl_firefox: { base: 'SauceLabs', browserName: 'firefox', version: '52' },
      sl_ie_10: { base: 'SauceLabs', browserName: 'internet explorer', platform: 'Windows 7', version: '10.0' },
      sl_ie_11: { base: 'SauceLabs', browserName: 'internet explorer', platform: 'Windows 7', version: '11.0' },
      sl_edge: { base: 'SauceLabs', browserName: 'MicrosoftEdge', platform: 'Windows 10', version: '16.16299' },
      sl_macos_safari: { base: 'SauceLabs', browserName: 'safari', platform: 'macOS 10.13', version: '11.1' }
    };
    configuration.browsers = Object.keys(configuration.customLaunchers);
  }

  config.set(configuration);
}
