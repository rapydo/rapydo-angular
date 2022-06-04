import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    watchForFileChanges: false,
    screenshotsFolder: "/cypress",
    videosFolder: "/cypress",
    downloadsFolder: "/cypress",
    retries: {
      openMode: 0,
      runMode: 0,
    },
  },
});
