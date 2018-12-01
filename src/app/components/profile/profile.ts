
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'profile',
  providers: [ApiService, AuthService],
  templateUrl: './profile.html'
})
export class ProfileComponent {

  private user: any

    constructor(api: ApiService, auth: AuthService) {

		this.user = auth.getUser();

    }
}
