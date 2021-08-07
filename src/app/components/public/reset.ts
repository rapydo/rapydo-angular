import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

import { NotificationService } from "@rapydo/services/notification";
import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";

import { environment } from "@rapydo/../environments/environment";

@Component({
  templateUrl: "reset.html",
})
export class ResetPasswordComponent implements OnInit {
  public resetForm: boolean;
  public token: string;
  public invalid_token: string;
  public reset_message: string;

  public step1_form = new FormGroup({});
  public step2_form = new FormGroup({});
  public step1_fields: FormlyFieldConfig[] = [];
  public step2_fields: FormlyFieldConfig[] = [];
  public model: any = {};

  public loading = false;

  public minPasswordLength: number = environment.minPasswordLength;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService,
    private api: ApiService,
    private authService: AuthService
  ) {
    this.route.params.subscribe((params) => {
      if (typeof params["token"] === "undefined") {
        this.resetForm = true;
      } else {
        this.api.put(`/auth/reset/${params["token"]}`).subscribe(
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
        placeholder: "Type here your email address to receive the reset link",
        addonLeft: {
          class: "fas fa-envelope",
        },
        required: true,
      },
      validators: { validation: ["email"] },
    });

    this.step2_fields.push({
      key: "newPwd",
      type: "password",
      templateOptions: {
        // type: "password",
        label: "New password",
        placeholder: "Type here your new password",
        addonLeft: {
          class: "fas fa-key",
        },
        required: true,
        minLength: environment.minPasswordLength,
      },
    });
    this.step2_fields.push({
      key: "confirmPwd",
      type: "password",
      templateOptions: {
        // type: "password",
        label: "Confirm password",
        placeholder: "Type again your new password for confirmation",
        addonLeft: {
          class: "fas fa-key",
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

  resetRequest(): void {
    if (!this.step1_form.valid) {
      return;
    }

    let data = { reset_email: this.model["reset_email"] };
    this.api
      .post<string>("/auth/reset", data, { validationSchema: "String" })
      .subscribe(
        (response) => {
          this.reset_message = response;
          this.model = {};
        },
        (error) => {
          this.notify.showError(error);
        }
      );
  }

  public changePassword(): void {
    if (!this.step2_form.valid) {
      return;
    }

    let data = {};
    data["new_password"] = this.model["newPwd"];
    data["password_confirm"] = this.model["confirmPwd"];

    this.api.put(`/auth/reset/${this.token}`, data).subscribe(
      (response) => {
        this.notify.showSuccess(
          "Password successfully changed. Please login with your new password"
        );

        this.router.navigate(["app", "login"]);
      },
      (error) => {
        this.notify.showError(error);
      }
    );
  }
}
