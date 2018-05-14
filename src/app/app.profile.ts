
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ApiService } from './services/api';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'profile',
  providers: [ApiService, AuthService],
  templateUrl: './app.profile.html'
})
export class ProfileComponent { 

  private user: any

	constructor(api: ApiService, auth: AuthService) {

			//console.log(api.get());
      this.user = auth.getUser();

	}
}
