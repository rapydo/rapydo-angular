
import { Component } from '@angular/core';

import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { NotificationService} from '../../services/notification';

@Component({
  selector: 'changepassword',
  providers: [ApiService, AuthService, NotificationService],
  templateUrl: './changepassword.html'
})
export class ChangePasswordComponent { 

  private user: any

	constructor(private api: ApiService, private auth: AuthService, private notify: NotificationService) {

			//console.log(api.get());
      this.user = auth.getUser();

	}

	changePassword(form: any): boolean {
		if (form.valid) {
			if (form.value["newPwd"] != form.value["confirmPwd"]) {
				this.notify.showError("New password does not match with confirmation");
				return false;
			}
			var data = {}
			data["new_password"] = form.value["newPwd"];
			data["password_confirm"] = form.value["confirmPwd"];

			if (form.value["currentPwd"])	
				data["password"] = form.value["currentPwd"];

			if (form.value["totp_code"])	
				data["password"] = form.value["totp_code"];

			return this.api.put('profile', "", data, {"base": "auth"}).subscribe(
				response => {
					form.value["newPwd"] = ""
					form.value["confirmPwd"]= ""
	    			this.notify.showSuccess("Password successfully changed. Please login with your new password")
	    			this.auth.logout().subscribe(
	    				function(response) {
			    			//$window.location.href = '/new/login';
			    			console.log("NOT IMPLEMENTED: redirect to login")
	    				}
	    			);

	    			return true;

				}, error => {
	    			this.notify.extractErrors(error, this.notify.ERROR);
	    			return false;
				}
			);

		} else {
			this.notify.showError("Invalid form...");

			return false;
		}
	}

}
