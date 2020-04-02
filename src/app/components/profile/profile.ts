import { Component } from '@angular/core';

import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'profile',
  templateUrl: 'profile.html'
})
export class ProfileComponent { 

  public user: any

  constructor(private api: ApiService, private auth: AuthService) {

      this.user = auth.getUser();

  }
}
