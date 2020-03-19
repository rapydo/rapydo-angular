import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '@rapydo/../environments/environment';

import { ApiService } from '@rapydo/services/api';
import { AuthService } from '@rapydo/services/auth';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
})
export class NavbarComponent implements OnInit {

  public user: any;
  public loading: boolean = true;

  public allowRegistration: boolean = false;
  public logoutConfirmationTitle:string = "Logout request";
  public logoutConfirmationMessage:string = "Do you really want to close this session?";

  private userChangedSubscription: Subscription;

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
  }

  ngOnInit() {
/*    
    this.auth.userChanged.subscribe(
      user => this.changeLogged(user)
    );
*/
    this.loading = true;
    this.auth.isAuthenticated().subscribe(
      is_auth => {
        if (is_auth) {
          this.user = this.auth.getUser();
        } else {
          this.user = null;
        }
        this.loading = false;
      }
    );

    this.userChangedSubscription = this.auth.userChanged.subscribe(
      user => this.changeLogged(user)
    );
  }
  ngOnDestroy() {
    this.userChangedSubscription.unsubscribe();
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
