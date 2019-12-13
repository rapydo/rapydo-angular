import { environment as base} from '/tmp/environment.variables' 

export const environment = {
	'production': true,
	'apiUrl': base.apiUrl,
	'authApiUrl': base.authApiUrl,
	'projectTitle': base.projectTitle,
	'projectDescription': base.projectDescription,
	'allowRegistration': base.allowRegistration,
	'allowPasswordReset': base.allowPasswordReset,
	'websocketsUrl': base.websocketsUrl,
	'SENTRY_URL': base.SENTRY_URL,
	'GA_TRACKING_CODE': base.GA_TRACKING_CODE,
	'ALL': {}
}

for (let key in base) {
	environment["ALL"][key] = base[key];
}
