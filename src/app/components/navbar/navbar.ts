import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@rapydo/../environments/environment';

import { ApiService } from '@rapydo/services/api';
import { AuthService } from '@rapydo/services/auth';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.html',
})
export class NavbarComponent {

  // @Input() user: any;
  public user: any;

  public allowRegistration: boolean = false;
  public logoutConfirmationTitle:string = "Logout request";
  public logoutConfirmationMessage:string = "Do you really want to close this session?";

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private ref: ChangeDetectorRef) { 

    if (typeof(environment.allowRegistration) === "boolean") {
      this.allowRegistration = JSON.parse(environment.allowRegistration)
    } else {
      this.allowRegistration = (environment.allowRegistration == "true");
    }

    this.user = this.auth.getUser();
    this.auth.userChanged.subscribe(
      user => this.changeLogged(user)
    );
  }

  changeLogged(user: any) {

    if (user == this.auth.LOGGED_OUT) {
      /*console.log("Received <" + user  + "> event");*/
      this.user = undefined;
      this.ref.detectChanges();

    } else if (user == this.auth.LOGGED_IN) {
      /*console.log("Received <" + user  + "> event");*/
      this.user = this.auth.getUser();

    } else {
      console.log("Received unknown user event: <" + user  + ">");
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
