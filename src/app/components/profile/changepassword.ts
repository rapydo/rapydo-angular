
import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

	constructor(
		private api: ApiService,
		private auth: AuthService,
		private notify: NotificationService,
		private router: Router

	) {

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
	    			this.auth.removeToken()

	    			this.router.navigate(['app', 'login']);

	    			return true;

				}, error => {
	    			this.notify.extractErrors(error, this.notify.ERROR);
	    			return false;
				}
			);

		} else {

			if (form.value["currentPwd"] == "") {
				this.notify.showError("Please provide your current password");
			} else if (form.value["newPwd"] == "") {
				this.notify.showError("Please provide your new password");
			} else if (form.value["confirmPwd"] == "") {
				this.notify.showError("Please confirm your new password");
			} else {
				this.notify.showError("Invalid form...");
				console.log(form);
			}

			return false;
		}
	}

}
