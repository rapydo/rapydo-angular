import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { environment } from "@rapydo/../environments/environment";

import { ProjectOptions } from "@app/customization";
import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { User } from "@rapydo/types";

@Component({
  selector: "navbar",
  templateUrl: "navbar.html",
})
export class NavbarComponent implements OnInit {
  public user: User;
  public loading: boolean = true;

  public allowRegistration: boolean = false;
  public logoutConfirmationTitle: string = "Logout request";
  public logoutConfirmationMessage: string =
    "Do you really want to close this session?";

  // This property tracks whether the menu is open.
  // Start with the menu collapsed so that it does not
  // appear initially when the page loads on a small screen
  public isMenuCollapsed = true;

  constructor(
    private router: Router,
    private customization: ProjectOptions,
    private api: ApiService,
    private auth: AuthService,
    private ref: ChangeDetectorRef
  ) {
    this.allowRegistration = environment.allowRegistration;
  }

  ngOnInit() {
    this.loading = true;
    this.auth.isAuthenticated().subscribe((is_auth) => {
      if (is_auth) {
        this.user = this.auth.getUser();
      } else {
        this.user = null;
      }
      this.loading = false;
    });

    this.auth.userChanged.subscribe((user) => this.changeLogged(user));
  }

  changeLogged(user: any) {
    if (user === this.auth.LOGGED_OUT) {
      this.user = null;
      this.ref.detectChanges();
    } else if (user === this.auth.LOGGED_IN) {
      this.user = this.auth.getUser();
      // } else {
      //   console.warn("Received unknown user event: <" + user + ">");
    }
  }

  do_logout() {
    this.auth.logout().subscribe((response) => {
      this.router.navigate([""]);
    });
  }
}
