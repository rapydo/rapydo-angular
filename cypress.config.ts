import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    watchForFileChanges: false,
    specPattern: "/e2e/**/*.ts",
    screenshotsFolder: "/cypress",
    video: true,
    videosFolder: "/cypress",
    downloadsFolder: "/cypress",
    supportFile: "/e2e/support/e2e.js",
    retries: {
      openMode: 0,
      runMode: 0,
    },
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      require("cypress-fail-fast/plugin")(on, config);

      // add other tasks to be registered here

      // IMPORTANT to return the config object
      // with the any changed environment variables
      return config;
    },
  },
});
