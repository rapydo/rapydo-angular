// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join('/coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      // Combines coverage information from multiple browsers into one report rather than outputting a report for each browser.
      combineBrowserReports: true,
      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,
      // Omit files with no statements, no functions and no branches from the report
      skipFilesWithNoCoverage: true
    },
    reporters: ['spec', 'progress', 'kjhtml', 'coverage-istanbul'],
    hostname: '0.0.0.0',
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    // For manual execution
    autoWatch: true,
    singleRun: false,
    // For CI execution
    // autoWatch: false,
    // singleRun: true,
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    browsers: ['ChromeHeadlessCI'],
    browserNoActivityTimeout: 60000,
    restartOnFileChange: true
  });
};
