// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { environment as base } from "/tmp/environment.variables";

export const environment = {
  production: false,
  backendURI: base.backendURI,
  apiUrl: base.apiUrl,
  projectVersion: base.projectVersion,
  rapydoVersion: base.rapydoVersion,
  projectTitle: base.projectTitle,
  projectDescription: base.projectDescription,
  enableFooter: base.enableFooter,
  allowRegistration: base.allowRegistration,
  allowPasswordReset: base.allowPasswordReset,
  allowTermsOfUse: base.allowTermsOfUse,
  websocketsUrl: base.websocketsUrl,
  SENTRY_URL: base.SENTRY_URL,
  GA_TRACKING_CODE: base.GA_TRACKING_CODE,
  ALL: {},
};

for (let key in base) {
  environment["ALL"][key] = base[key];
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
