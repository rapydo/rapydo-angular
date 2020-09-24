import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

import { environment } from "@rapydo/../environments/environment";

import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";

import { ProjectOptions } from "@app/custom.project.options";

@Component({
  templateUrl: "register.html",
})
export class RegisterComponent implements OnInit {
  public allowRegistration: boolean = false;

  public registration_title: string;
  public showRegistrationForm: boolean = false;
  public registration_message: string;
  public invalid_token: boolean = false;
  public disclaimer: string;

  public form = new FormGroup({});
  public fields: FormlyFieldConfig[] = [];
  public model: any = {};

  public loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService,
    private api: ApiService,
    private authService: AuthService,
    private customization: ProjectOptions
  ) {
    this.allowRegistration = customization.allowRegistration;

    this.route.params.subscribe((params) => {
      if (typeof params["token"] !== "undefined") {
        this.registration_title = "Validating activation token...";
        this.api.put("/auth/profile/activate/" + params["token"]).subscribe(
          (response) => {
            this.invalid_token = false;
            this.showRegistrationForm = false;
            this.registration_title = "Registraction activated";
            this.notify.showSuccess("User successfully activated.");
            this.router.navigate(["app", "login"]);
            return true;
          },
          (error) => {
            this.invalid_token = true;
            this.showRegistrationForm = false;
            this.registration_title = "Invalid activation token";
            this.notify.showError(error);
            return false;
          }
        );
      } else {
        this.showRegistrationForm = this.allowRegistration;
        this.registration_title = "Register a new account";
      }
    });
  }

  ngOnInit() {
    // retrieve custom fields from apis

    // initial disclaimer

    this.fields.push({
      key: "name",
      type: "input",
      templateOptions: {
        type: "text",
        label: "Name",
        placeholder: "Type here your name",
        addonLeft: {
          class: "fas fa-user",
        },
        required: true,
      },
    });

    this.fields.push({
      key: "surname",
      type: "input",
      templateOptions: {
        type: "text",
        label: "Surname",
        placeholder: "Type here your surname",
        addonLeft: {
          class: "fas fa-user",
        },
        required: true,
      },
    });

    this.fields.push({
      key: "email",
      type: "input",
      templateOptions: {
        type: "email",
        label: "Username (email address)",
        placeholder: "Type here your email address",
        addonLeft: {
          class: "fas fa-envelope",
        },
        required: true,
      },
      validators: { validation: ["email"] },
    });

    this.fields.push({
      key: "password",
      type: "input",
      templateOptions: {
        type: "password",
        label: "Password",
        placeholder: "Type here the desidered password",
        addonLeft: {
          class: "fas fa-key",
        },
        required: true,
        minLength: 8,
      },
    });

    this.fields.push({
      key: "password_confirm",
      type: "input",
      templateOptions: {
        type: "password",
        label: "Password confirmation",
        placeholder: "Type again the desidered password for confirmation",
        addonLeft: {
          class: "fas fa-key",
        },
        required: true,
      },
      validators: {
        fieldMatch: {
          expression: (control) => control.value === this.model.password,
          message: "Password not matching",
        },
      },
    });

    if (this.customization.allowTermsOfUse) {
      console.log("?");
    }

    this.disclaimer = this.customization.registration_disclaimer();

    const custom = this.customization.custom_registration_options();
    if (custom) {
      for (let field of custom) {
        this.fields.push(field);
      }
    }
  }

  register() {
    if (!this.form.valid) {
      return false;
    }
    this.loading = true;
    this.api
      .post<string>("/auth/profile", this.model, { validationSchema: "String" })
      .subscribe(
        (data) => {
          this.showRegistrationForm = false;
          this.registration_title = "Account registered";
          this.registration_message =
            "User successfully registered. You will receive an email to confirm your registraton and activate your account";

          this.notify.showSuccess("User successfully registered");
          this.loading = false;
        },
        (error) => {
          this.notify.showError(error);
          this.loading = false;
        }
      );
  }
}
