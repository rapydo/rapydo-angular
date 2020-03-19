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
    // Reporter options
    briefReporter: {
      // Suppress the error report at the end of the test run.
      suppressErrorReport: false, // default is false
 
      // Print the test failures immediately instead of at the end.
      // The brief summary is updated on the last line. If this
      // is set to true, suppressErrorReport must be set to false.
      // Enable this, if you want to watch the failed test names
      // and descriptions and break the test run, when you want.
      earlyErrorReport: false, // default is false
 
      // Suppress the red background on errors in the error
      // report at the end of the test run.
      suppressErrorHighlighting: false, // default is false
 
      // Omits stack frames from external dependencies like qunit,
      // jasmine or chai, which appear in stack traces of failed
      // tests and which are usually irrelevant to the tested code.
      omitExternalStackFrames: false, // default is false
 
      // Suppress the browser console log at the end of the test run.
      suppressBrowserLogs: false, // default is false
 
      // Only render the graphic after all tests have finished.
      // This is ideal for using this reporter in a continuous
      // integration environment.
      renderOnRunCompleteOnly: true // default is false
    },
    reporters: ['brief', 'progress', 'kjhtml', 'coverage-istanbul'],
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
