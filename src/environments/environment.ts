// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { environment as base } from "/tmp/environment.variables";

interface Env {
  production: boolean;
  backendURI: string;
  projectVersion: string;
  projectBuild: string;
  rapydoVersion: string;
  projectName: string;
  projectTitle: string;
  projectDescription: string;
  projectKeywords: string;
  authEnabled: boolean;
  showLogin: boolean;
  enableFooter: boolean;
  allowRegistration: boolean;
  allowPasswordReset: boolean;
  allowTermsOfUse: boolean;
  minPasswordLength: number;
  forceSSRServerMode: boolean;
  spinnerType: string;
  multiLang: boolean;
  SENTRY_URL: string;
  CUSTOM: Record<string, any>;
}
export const environment: Env = {
  production: false,
  backendURI: base.backendURI,
  projectVersion: base.projectVersion,
  projectBuild: base.projectBuild,
  rapydoVersion: base.rapydoVersion,
  projectName: base.projectName,
  projectTitle: base.projectTitle,
  projectDescription: base.projectDescription,
  projectKeywords: base.projectKeywords,
  authEnabled: base.authEnabled === "1",
  // Temporary Compatibility fix, remove === "true" in a near future
  showLogin: base.showLogin === "1" || base.showLogin === "true",
  enableFooter: base.enableFooter === "1" || base.enableFooter === "true",
  allowRegistration:
    base.allowRegistration === "1" || base.allowRegistration === "true",
  allowPasswordReset:
    base.allowPasswordReset === "1" || base.allowPasswordReset === "true",
  allowTermsOfUse:
    base.allowTermsOfUse === "1" || base.allowTermsOfUse === "true",
  minPasswordLength: parseInt(base.minPasswordLength),
  forceSSRServerMode:
    base.forceSSRServerMode === "1" || base.forceSSRServerMode === "true",
  spinnerType: base.spinnerType,
  multiLang: base.multiLang === "1" || base.multiLang === "true",
  SENTRY_URL: base.SENTRY_URL,
  CUSTOM: {},
};

for (let key in base) {
  if (!(key in environment)) {
    environment.CUSTOM[key] = base[key];
  }
}
