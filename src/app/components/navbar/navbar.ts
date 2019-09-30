import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@rapydo/../environments/environment';

import { ApiService } from '@rapydo/services/api';
import { AuthService } from '@rapydo/services/auth';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.html',
})
export class NavbarComponent {

  @Input() user: any;

  public allowRegistration: boolean = false;
  public logoutConfirmationTitle:string = "Logout request";
  public logoutConfirmationMessage:string = "Do you really want to close this session?";

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService) { 

            if (typeof(environment.allowRegistration) === "boolean") {
                this.allowRegistration = JSON.parse(environment.allowRegistration)
            } else {
                this.allowRegistration = (environment.allowRegistration == "true");
            }
  }

  do_logout() {
    this.auth.logout().subscribe(
      response =>  {
        this.router.navigate(['']);
      }
    );
  }

}
