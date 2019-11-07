import { environment as base} from '/tmp/environment.variables' 

export const environment = {
	'production': true,
	'apiUrl': base.apiUrl,
	'authApiUrl': base.authApiUrl,
	'projectTitle': base.projectTitle,
	'projectDescription': base.projectDescription,
	'allowRegistration': base.allowRegistration,
	'allowPasswordReset': base.allowPasswordReset,
	'enableToastr': base.enableToastr
}
