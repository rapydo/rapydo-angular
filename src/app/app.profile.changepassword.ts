
import { Component } from '@angular/core';

import { ApiService } from './api.service';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'changepassword',
  providers: [ApiService, AuthService],
  templateUrl: './app.profile.changepassword.html'
})
export class ChangePasswordComponent { 

  private user: any

	constructor(api: ApiService, auth: AuthService) {

			//console.log(api.get());
      this.user = auth.getUser();

	}

	changePassword(form: any): void {
		console.log("evviva");
		console.log(form.value);
		console.log(form.valid);
	}

}
