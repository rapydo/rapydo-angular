// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      require("karma-spec-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        // stop execution of the suite after the first spec failure
        stopOnSpecFailure: true,
        // do not  randomize spec execution order
        random: false,
      },
    },
    coverageReporter: {
      dir: require("path").join("/coverage"),
      reporters: [
        // reporters not supporting the `file` property
        { type: "lcov", subdir: "." },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: "lcovonly", subdir: ".", file: "report-lcovonly.txt" },
        { type: "text", subdir: ".", file: "text.txt" },
        { type: "text-summary", subdir: ".", file: "text-summary.txt" },
      ],
      // Combines coverage information from multiple browsers into one report rather than output a report for each browser
      combineBrowserReports: true,
      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,
      // Omit files with no statements, no functions and no branches from the report
      skipFilesWithNoCoverage: false,
    },
    reporters: ["spec", "coverage"],
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      "app/**/*.ts": ["coverage"],
    },
    hostname: "0.0.0.0",
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
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
    browsers: ["ChromeHeadlessCI"],
    browserNoActivityTimeout: 60000,
    restartOnFileChange: true,
  });
};
