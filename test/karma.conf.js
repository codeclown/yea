const helperServer = require('./server/helper-server');

module.exports = function(config) {
  // Karma config is some of the most horrifying things I've seen... anyway, here goes

  const configuration = {
    basePath: '../',
    files: [
      'test/specs/*.js',
      'build/yea.min.js'
    ],
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

  if (process.env.TRAVIS) {
    // configuration.reporters.push('saucelabs');
    configuration.plugins.push('karma-sauce-launcher');
    configuration.sauceLabs = {
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || Date.now().toString(),
      recordScreenshots: false,
      startConnect: true,
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
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
      // sl_ie_11: { base: 'SauceLabs', browserName: 'internet explorer', platform: 'Windows 8.1', version: '11' },
      // sl_ios_safari: { base: 'SauceLabs', browserName: 'iphone', platform: 'OS X 10.9', version: '7.1' },
      // sl_android: { base: 'SauceLabs', browserName: 'Browser', platform: 'Android', version: '4.4', deviceName: 'Samsung Galaxy S3 Emulator', deviceOrientation: 'portrait' }
    };
    configuration.browsers = Object.keys(configuration.customLaunchers);
  }

  config.set(configuration);
}
