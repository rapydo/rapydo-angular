
import { Component } from '@angular/core';

import { ApiService } from './api.service';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'sessions',
  providers: [ApiService, AuthService],
  templateUrl: './app.profile.sessions.html'
})
export class SessionsComponent { 

  private user: any

	constructor(api: ApiService, auth: AuthService) {

			//console.log(api.get());
      this.user = auth.getUser();

	}

}
