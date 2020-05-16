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
