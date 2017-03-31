(function() {
  'use strict';

angular.module('web')
    .controller('ProfileController', ProfileController);

function ProfileController($scope, $log, $state, $auth, api, noty)
{
	var self = this;

	// var token_in_use = $auth.getToken();

	self.changePassword = function(uuid) {

		if (self.newPwd != self.confirmPwd) {
			noty.showError("New password does not match with confirmation");
			return false;
		}

		var data = {}
		data["new_password"] = self.newPwd;
		data["password_confirm"] = self.confirmPwd;

		if (self.currentPwd)	
			data["password"] = self.currentPwd;

		if (self.totp_code)
			data["totp_code"] = self.totp_code;

		// api.apiCall('profile/'+uuid, 'PUT', data).then(
		api.apiCall('profile', 'PUT', data).then(
			function(out_data) {
				self.newPwd = ""
				self.confirmPwd = ""
    			noty.showSuccess("Password successfully changed. Please login with your new password")
    			$auth.removeToken();
    			$state.go("public.login");
	        	return true;
    		},
    		function(out_data) {
    			noty.extractErrors(out_data, noty.ERROR);
	        	return false;
			}
		);
	};
}

})();

