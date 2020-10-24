import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { environment } from "@rapydo/../environments/environment";

import { ProjectOptions } from "@app/customization";
import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { ConfirmationModals } from "@rapydo/services/confirmation.modals";
import { User, ConfirmationModalOptions } from "@rapydo/types";

@Component({
  selector: "navbar",
  templateUrl: "navbar.html",
})
export class NavbarComponent implements OnInit {
  public user: User;
  public loading: boolean = true;

  public allowRegistration: boolean = false;

  // This property tracks whether the menu is open.
  // Start with the menu collapsed so that it does not
  // appear initially when the page loads on a small screen
  public isMenuCollapsed = true;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private customization: ProjectOptions,
    private api: ApiService,
    private auth: AuthService,
    private confirmationModals: ConfirmationModals,
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

  do_logout(): void {
    const options: ConfirmationModalOptions = {
      text: "Do you really want to close the current session?",
      disableSubText: true,
      confirmButton: "Confirm",
      cancelButton: "Cancel",
    };

    this.confirmationModals.open(options).then(
      (result) => {
        this.auth.logout().subscribe((response) => {
          this.router.navigate([""]);
        });
      },
      (reason) => {}
    );
  }
}
