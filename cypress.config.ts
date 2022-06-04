import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    watchForFileChanges: false,
    supportFile: false,
    specPattern: "/app/cypress/e2e/**/*.ts",
    screenshotsFolder: "/cypress",
    videosFolder: "/cypress",
    downloadsFolder: "/cypress",
    retries: {
      openMode: 0,
      runMode: 0,
    },
  },
});
