import { Component } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

import { AuthService, User } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";

@Component({
  templateUrl: "profile.html",
})
export class ProfileComponent {
  public user: User;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NotificationService,
    private auth: AuthService
  ) {
    // this.user = auth.getUser();
    this.spinner.show();
    this.auth.loadUser().subscribe(
      (response) => {
        this.user = response;
        this.spinner.hide();
      },
      (error) => {
        this.notification.showError(error);
        this.spinner.hide();
      }
    );
  }
}
