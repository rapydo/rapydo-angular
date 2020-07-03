import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

import { NotificationService } from "../../services/notification";
import { ApiService } from "../../services/api";
import { AuthService } from "../../services/auth";

@Component({
  templateUrl: "reset.html",
})
export class ResetPasswordComponent implements OnInit {
  public token: string;
  public invalid_token: string;
  public reset_message: string;

  public step1_form = new FormGroup({});
  public step2_form = new FormGroup({});
  public step1_fields: FormlyFieldConfig[] = [];
  public step2_fields: FormlyFieldConfig[] = [];
  public model: any = {};

  public loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService,
    private api: ApiService,
    private authService: AuthService
  ) {
    this.route.params.subscribe((params) => {
      if (typeof params["token"] !== "undefined") {
        this.api.put("reset", params["token"], {}, { base: "auth" }).subscribe(
          (response) => {
            this.token = params["token"];
            return true;
          },
          (error) => {
            this.token = null;
            this.invalid_token = error;
            this.notify.showError(this.invalid_token);
            return false;
          }
        );
      }
    });
  }

  ngOnInit() {
    // reset login status
    this.authService.logout();

    this.step1_fields.push({
      key: "reset_email",
      type: "input",
      templateOptions: {
        type: "email",
        label: "Your e-mail address",
        addonLeft: {
          class: "fa fa-envelope",
        },
        required: true,
      },
      validators: { validation: ["email"] },
    });

    this.step2_fields.push({
      key: "newPwd",
      type: "input",
      templateOptions: {
        type: "password",
        label: "New password",
        placeholder: "Type here your new password",
        addonLeft: {
          class: "fa fa-key",
        },
        required: true,
        minLength: 8,
      },
    });
    this.step2_fields.push({
      key: "confirmPwd",
      type: "input",
      templateOptions: {
        type: "password",
        label: "Confirm password",
        placeholder: "Type again your new password for confirmation",
        addonLeft: {
          class: "fa fa-key",
        },
        required: true,
      },
      validators: {
        fieldMatch: {
          expression: (control) => control.value === this.model.newPwd,
          message: "Password not matching",
        },
      },
    });
  }

  resetRequest(): boolean {
    if (!this.step1_form.valid) {
      return false;
    }

    let data = { reset_email: this.model["reset_email"] };
    return this.api.post("reset", data, { base: "auth" }).subscribe(
      (response) => {
        this.reset_message = response;
        this.model = {};
        return true;
      },
      (error) => {
        this.notify.showError(error);
        return false;
      }
    );
  }

  public changePassword(): boolean {
    if (!this.step2_form.valid) {
      return false;
    }

    let data = {};
    data["new_password"] = this.model["newPwd"];
    data["password_confirm"] = this.model["confirmPwd"];

    return this.api.put("reset", this.token, data, { base: "auth" }).subscribe(
      (response) => {
        this.notify.showSuccess(
          "Password successfully changed. Please login with your new password"
        );

        this.router.navigate(["app", "login"]);
        return true;
      },
      (error) => {
        this.notify.showError(error);
        return false;
      }
    );
  }
}
