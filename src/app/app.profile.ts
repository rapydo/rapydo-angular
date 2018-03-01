
import { Component } from '@angular/core';

import { ApiService } from './api.service';
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
