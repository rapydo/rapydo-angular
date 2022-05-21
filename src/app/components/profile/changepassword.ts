import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";

import { environment } from "@rapydo/../environments/environment";

@Component({
  templateUrl: "changepassword.html",
})
export class ChangePasswordComponent {
  public form = new FormGroup({});
  public fields: FormlyFieldConfig[] = [];
  public model: any = {};
  private user: any;

  public minPasswordLength: number = environment.minPasswordLength;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {
    this.user = auth.getUser();

    if (this.user && this.user.two_factor_enabled) {
      this.fields.push({
        key: "totp_code",
        type: "input",
        templateOptions: {
          type: "string",
          label: "Verification code",
          placeholder: "TOTP verification code",
          addonLeft: {
            class: "fas fa-shield-blank",
          },
          required: true,
        },
        validators: { validation: ["totp"] },
      });
    }
    this.fields.push({
      key: "currentPwd",
      type: "password",
      templateOptions: {
        // type: "password",
        label: "Current password",
        placeholder: "Type here your current password",
        addonLeft: {
          class: "fas fa-key",
        },
        required: true,
      },
    });

    this.fields.push({
      key: "newPwd",
      type: "password",
      templateOptions: {
        // type: "password",
        label: "New password",
        placeholder: "Type the desidered new password",
        addonLeft: {
          class: "fas fa-key",
        },
        required: true,
        minLength: environment.minPasswordLength,
      },
    });
    this.fields.push({
      key: "confirmPwd",
      type: "password",
      templateOptions: {
        // type: "password",
        label: "Confirm password",
        placeholder: "Type again the new password for confirmation",
        addonLeft: {
          class: "fas fa-key",
        },
        required: true,
      },
      validators: {
        fieldMatch: {
          expression: (control) => control.value === this.model.newPwd,
          message: "The password does not match",
        },
      },
    });
  }

  submit() {
    if (!this.form.valid) {
      return false;
    }

    let data = {
      new_password: this.model["newPwd"],
      password_confirm: this.model["confirmPwd"],
      password: this.model["currentPwd"],
    };

    if (this.model["totp_code"]) {
      data["totp_code"] = this.model["totp_code"];
    }

    if (this.auth.getUser() === null) {
      this.router.navigate([""]);
      return false;
    }
    let username = this.auth.getUser().email;
    this.auth.change_password(data).subscribe(
      (response) => {
        this.model["newPwd"] = "";
        this.model["confirmPwd"] = "";
        this.notify.showSuccess("Password successfully changed");

        // With TOTP enabled the automatic login is not allowed due to the TOTP request
        if (this.user && this.user.two_factor_enabled) {
          this.router.navigate(["/app/login"]);
        } else {
          this.auth.login(username, data["new_password"]).subscribe(
            (data) => {
              this.auth.loadUser().subscribe(
                (response) => {
                  this.router.navigate([""]);
                },
                (error) => {
                  this.notify.showError(error);
                }
              );
            },
            (error) => {
              this.notify.showError(error);
            }
          );
        }
      },
      (error) => {
        this.notify.showError(error);
      }
    );
  }
}
