module.exports = (on, config) => {
  require("@cypress/code-coverage/task")(on, config);

  // https://docs.cypress.io/api/plugins/browser-launch-api#Modify-browser-launch-arguments-preferences-and-extensions
  on("before:browser:launch", (browser = {}, launchOptions) => {
    // `args` is an array of all the arguments that will
    // be passed to browsers when it launches
    console.log(launchOptions.args); // print all current args

    if (browser.name === "chrome" && browser.isHeadless) {
      // fullPage screenshot size is 1280x720 on non-retina screens
      // and 2560x1440 on retina screens
      launchOptions.args.push("--window-size=1280,720");

      // force screen to be non-retina (1280x720 size)
      launchOptions.args.push("--force-device-scale-factor=1");

      // force screen to be retina (2560x1440 size)
      // launchOptions.args.push('--force-device-scale-factor=2')
    }

    if (browser.name === "electron" && browser.isHeadless) {
      // fullPage screenshot size is 1280x720
      launchOptions.preferences.width = 1280;
      launchOptions.preferences.height = 720;
    }

    if (browser.name === "firefox" && browser.isHeadless) {
      // menubars take up height on the screen
      // so fullPage screenshot size is 1280x646
      launchOptions.args.push("--width=1280");
      launchOptions.args.push("--height=720");
    }

    if (browser.family === "chromium" && browser.name !== "electron") {
      // auto open devtools
      launchOptions.args.push("--auto-open-devtools-for-tabs");
    }

    if (browser.family === "firefox") {
      // auto open devtools
      launchOptions.args.push("-devtools");
    }

    if (browser.name === "electron") {
      // auto open devtools
      launchOptions.preferences.devTools = true;
    }

    // whatever you return here becomes the launchOptions
    return launchOptions;
  });
  // add other tasks to be registered here

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
};
