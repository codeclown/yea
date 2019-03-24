const helperServer = require('./helper-server');

module.exports = function(config) {
  // Karma config is some of the most horrifying things I've seen... anyway, here goes

  config.set({
    basePath: '../',
    files: [
      'test/specs/*.js',
      'build/supreme-ajax.min.js'
    ],
    exclude: [],
    frameworks: ['mocha', 'chai'],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity,

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
  })
}
