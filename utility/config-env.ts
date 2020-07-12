const { Console } = require("console");
const print = new Console(process.stdout, process.stderr);

var fs = require("fs");

require("dotenv").config({ path: "/tmp/.env" });

let backendURI = "";

if (
  typeof process.env.BACKEND_URI !== "undefined" &&
  process.env.BACKEND_URI !== null &&
  process.env.BACKEND_URI !== ""
) {
  backendURI = process.env.BACKEND_URI;
} else {
  if (process.env.APP_MODE === "production") {
    backendURI += "https://";
  } else if (
    process.env.APP_MODE === "debug" ||
    process.env.APP_MODE === "test" ||
    process.env.APP_MODE === "development" ||
    process.env.APP_MODE === "cypress"
  ) {
    backendURI += "http://";
  } else {
    print.error("Unknown APP MODE: " + process.env.APP_MODE);
    backendURI += "http://";
  }

  backendURI += process.env.BACKEND_HOST;
  backendURI += ":";
  backendURI += process.env.BACKEND_PORT;

  backendURI += process.env.BACKEND_PREFIX;
}

let websocketsURI = "";
websocketsURI += process.env.PUSHPIN_HOST;
websocketsURI += ":";
websocketsURI += process.env.PUSHPIN_PORT;

let apiUrl = backendURI + "/api";
let authApiUrl = backendURI + "/auth";

let projectVersion = process.env.VERSION;
let rapydoVersion = process.env.RAPYDO_VERSION;
let projectTitle = process.env.PROJECT_TITLE;
let projectDescription = process.env.PROJECT_DESCRIPTION;

let enableFooter = process.env.ENABLE_FOOTER.toLowerCase() === "true";
let allowRegistration = process.env.ALLOW_REGISTRATION.toLowerCase() === "true";
let allowPasswordReset =
  process.env.ALLOW_PASSWORD_RESET.toLowerCase() === "true";
let allowTermsOfUse = process.env.ALLOW_TERMS_OF_USE.toLowerCase() === "true";
let SENTRY_URL = process.env.SENTRY_URL;
let GA_TRACKING_CODE = process.env.GA_TRACKING_CODE;

// Trimming ' character from title and description
if (projectTitle.charAt(0) === "'") {
  projectTitle = projectTitle.substr(1);
}
if (projectDescription.charAt(0) === "'") {
  projectDescription = projectDescription.substr(1);
}
if (projectTitle.slice(projectTitle.length - 1) === "'") {
  projectTitle = projectTitle.slice(0, -1);
}
if (projectDescription.slice(projectDescription.length - 1) === "'") {
  projectDescription = projectDescription.slice(0, -1);
}

const targetPath = `/tmp/environment.variables.ts`;
const INJECT_KEY = "INJECT_";

let envConfigFile = `
export const environment = { 
    apiUrl: '${apiUrl}',
    authApiUrl: '${authApiUrl}',
    projectVersion: '${projectVersion}',
    rapydoVersion: '${rapydoVersion}',
    projectTitle: '${projectTitle}',
    projectDescription: '${projectDescription}',
    enableFooter: '${enableFooter}',
    allowRegistration: '${allowRegistration}',
    allowPasswordReset: '${allowPasswordReset}',
    allowTermsOfUse: '${allowTermsOfUse}',
    websocketsUrl: '${websocketsURI}',`;
for (let key in process.env) {
  if (key.startsWith(INJECT_KEY)) {
    let k = key.substr(INJECT_KEY.length);
    envConfigFile += `
    ${k}: '${process.env[key]}',`;
  }
}
envConfigFile += `  
    SENTRY_URL: '${SENTRY_URL}',
    GA_TRACKING_CODE: '${GA_TRACKING_CODE}'
};
`;
fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    print.error(err);
  }
});
