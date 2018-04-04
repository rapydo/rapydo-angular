
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ApiService } from './api.service';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'profile',
  providers: [ApiService, AuthService],
  templateUrl: './app.profile.html'
})
export class ProfileComponent { 

	form = new FormGroup({});
	model = {email: 'email@gmail.com'};
	fields: FormlyFieldConfig[] = [{
		key: 'email',
		type: 'input',
		templateOptions: {
			type: 'email',
			label: 'Email address',
			placeholder: 'Enter email',
			required: true,
		}
	}]
  
  private user: any

	constructor(api: ApiService, auth: AuthService) {

			//console.log(api.get());
      this.user = auth.getUser();

	}

	submit(model) {
		console.log(model);
	}
}
