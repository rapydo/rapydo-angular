
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'profile',
  providers: [ApiService, AuthService],
  templateUrl: './profile.html'
})
export class ProfileComponent { 

  public user: any

  constructor(api: ApiService, auth: AuthService) {

      //console.log(api.get());
      this.user = auth.getUser();

  }
}
