module.exports = (on, config) => {
  require("@cypress/code-coverage/task")(on, config);

  // add other tasks to be registered here

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
};

// this is the version from:
// https://github.com/skylock/cypress-angular-coverage-example

// module.exports = (on, config) => {
//   on('task', require('@cypress/code-coverage/task'))
// }

const xlsx = require("node-xlsx").default;
const fs = require("fs");
const path = require("path");

// Thank you Vivek Nayyar
// https://dev.to/viveknayyar/e2e-testing-of-excel-downloads-with-cypress-21fb
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  on("task", {
    parseXlsx({ filePath }) {
      return new Promise((resolve, reject) => {
        try {
          const jsonData = xlsx.parse(fs.readFileSync(filePath));
          resolve(jsonData);
        } catch (e) {
          reject(e);
        }
      });
    },
  });

  // https://docs.cypress.io/api/plugins/browser-launch-api.html#Change-download-directory
  on("before:browser:launch", (browser, options) => {
    const downloadDirectory = path.join(__dirname, "..", "downloads");

    if (browser.family === "chromium" && browser.name !== "electron") {
      options.preferences.default["download"] = {
        default_directory: downloadDirectory,
      };

      return options;
    }

    if (browser.family === "firefox") {
      options.preferences["browser.download.dir"] = downloadDirectory;
      options.preferences["browser.download.folderList"] = 2;

      // needed to prevent download prompt for text/csv files.
      options.preferences["browser.helperApps.neverAsk.saveToDisk"] =
        "text/csv";

      return options;
    }
  });
};
