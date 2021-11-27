import { environment } from "@rapydo/../environments/environment";

describe("Environment", () => {
  it("environment", () => {
    expect(environment).not.toBeUndefined();

    expect(environment.production).not.toBeUndefined();
    expect(environment.backendURI).not.toBeUndefined();
    expect(environment.projectVersion).not.toBeUndefined();
    expect(environment.projectBuild).not.toBeUndefined();
    expect(environment.rapydoVersion).not.toBeUndefined();
    expect(environment.projectName).not.toBeUndefined();
    expect(environment.projectTitle).not.toBeUndefined();
    expect(environment.projectDescription).not.toBeUndefined();
    expect(environment.projectKeywords).not.toBeUndefined();
    expect(environment.authEnabled).not.toBeUndefined();
    expect(environment.showLogin).not.toBeUndefined();
    expect(environment.enableFooter).not.toBeUndefined();
    expect(environment.allowRegistration).not.toBeUndefined();
    expect(environment.allowPasswordReset).not.toBeUndefined();
    expect(environment.allowTermsOfUse).not.toBeUndefined();
    expect(environment.minPasswordLength).not.toBeUndefined();
    expect(environment.forceSSRServerMode).not.toBeUndefined();
    expect(environment.websocketsUrl).not.toBeUndefined();
    expect(environment.SENTRY_URL).not.toBeUndefined();
    expect(environment.GA_TRACKING_CODE).not.toBeUndefined();
    expect(environment.CUSTOM).not.toBeUndefined();
  });
});
