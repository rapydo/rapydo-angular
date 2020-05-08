import { environment } from '@rapydo/../environments/environment'

describe('Environment', () => {

	it('environment', () => {

      	expect(environment).not.toBeUndefined();

		expect(environment.production).not.toBeUndefined();
		expect(environment.apiUrl).not.toBeUndefined();
		expect(environment.authApiUrl).not.toBeUndefined();
		expect(environment.projectVersion).not.toBeUndefined();
		expect(environment.rapydoVersion).not.toBeUndefined();
		expect(environment.projectTitle).not.toBeUndefined();
		expect(environment.projectDescription).not.toBeUndefined();
		expect(environment.enableFooter).not.toBeUndefined();
		expect(environment.allowRegistration).not.toBeUndefined();
		expect(environment.allowPasswordReset).not.toBeUndefined();
		expect(environment.websocketsUrl).not.toBeUndefined();
		expect(environment.WRAP_RESPONSE).not.toBeUndefined();
		expect(environment.SENTRY_URL).not.toBeUndefined();
		expect(environment.GA_TRACKING_CODE).not.toBeUndefined();
		expect(environment.ALL).not.toBeUndefined();

	});

});