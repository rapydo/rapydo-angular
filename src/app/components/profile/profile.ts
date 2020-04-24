import { Component } from '@angular/core';

import { ApiService } from '../../services/api';
import { AuthService, User } from '../../services/auth';


@Component({
  templateUrl: 'profile.html'
})
export class ProfileComponent { 

  public user: User;

  constructor(private api: ApiService, private auth: AuthService) {

      this.user = auth.getUser();

  }
}
