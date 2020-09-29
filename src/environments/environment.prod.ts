// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { environment as base } from "/tmp/environment.variables";

interface Env {
  production: boolean;
  backendURI: string;
  projectVersion: string;
  rapydoVersion: string;
  projectTitle: string;
  projectDescription: string;
  enableFooter: boolean;
  allowRegistration: boolean;
  allowPasswordReset: boolean;
  allowTermsOfUse: boolean;
  SENTRY_URL: string;
  websocketsUrl: string;
  GA_TRACKING_CODE: string;
  CUSTOM: Record<string, any>;
}
export const environment: Env = {
  production: true,
  backendURI: base.backendURI,
  projectVersion: base.projectVersion,
  rapydoVersion: base.rapydoVersion,
  projectTitle: base.projectTitle,
  projectDescription: base.projectDescription,
  enableFooter: base.enableFooter === "true",
  allowRegistration: base.allowRegistration === "true",
  allowPasswordReset: base.allowPasswordReset === "true",
  allowTermsOfUse: base.allowTermsOfUse === "true",
  websocketsUrl: base.websocketsUrl,
  SENTRY_URL: base.SENTRY_URL,
  GA_TRACKING_CODE: base.GA_TRACKING_CODE,
  CUSTOM: {},
};

for (let key in base) {
  environment.CUSTOM[key] = base[key];
}
