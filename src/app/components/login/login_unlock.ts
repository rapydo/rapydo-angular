import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

import { ApiService } from "@rapydo/services/api";
import { NotificationService } from "@rapydo/services/notification";

@Component({
  templateUrl: "login_unlock.html",
})
export class LoginUnlockComponent {
  public invalid_token: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService,
    private spinner: NgxSpinnerService,
    private api: ApiService
  ) {
    this.spinner.show();
    this.route.params.subscribe((params) => {
      if (typeof params["token"] !== "undefined") {
        this.api.post(`/auth/login/unlock/${params["token"]}`).subscribe(
          (response) => {
            this.spinner.hide();
            this.notify.showSuccess("Credentials successfully unlocked");
            this.router.navigate(["/app/login"]);
            return true;
          },
          (error) => {
            this.invalid_token = error;
            this.spinner.hide();
            this.notify.showError(this.invalid_token);
            return false;
          }
        );
      }
    });
  }
}
