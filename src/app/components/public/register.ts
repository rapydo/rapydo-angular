import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

import { environment } from "@rapydo/../environments/environment";

import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";
import { FormlyService } from "@rapydo/services/formly";
import { NgxSpinnerService } from "ngx-spinner";

import { ProjectOptions } from "@app/customization";
import { Schema } from "@rapydo/types";

@Component({
  templateUrl: "register.html",
})
export class RegisterComponent {
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
    private spinner: NgxSpinnerService,
    private notify: NotificationService,
    private api: ApiService,
    private authService: AuthService,
    private formly: FormlyService,
    private customization: ProjectOptions
  ) {
    this.allowRegistration = environment.allowRegistration;

    this.route.params.subscribe((params) => {
      if (typeof params["token"] !== "undefined") {
        this.registration_title = "Validating activation token...";
        this.api.put(`/auth/profile/activate/${params["token"]}`).subscribe(
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

        this.spinner.show();
        this.api
          .post<Schema[]>("/auth/profile", { get_schema: true })
          .subscribe(
            (response) => {
              this.createRegistrationForm(response);
              this.spinner.hide();
            },
            (error) => {
              this.notify.showError(error);
              this.spinner.hide();
            }
          );
      }
    });
  }

  private createRegistrationForm(response) {
    let data = this.formly.json2Form(response, {});

    this.fields = data.fields;
    this.model = data.model;

    for (let f of this.fields) {
      if (f.key === "name") {
        f.templateOptions.placeholder = "Type here your name";
        f.templateOptions.addonLeft = { class: "fas fa-user" };
      } else if (f.key === "surname") {
        f.templateOptions.placeholder = "Type here your surname";
        f.templateOptions.addonLeft = { class: "fas fa-user" };
      } else if (f.key === "email") {
        f.templateOptions.placeholder = "Type here your email address";
        f.templateOptions.addonLeft = { class: "fas fa-envelope" };
      } else if (f.key === "password") {
        f.templateOptions.addonLeft = { class: "fas fa-key" };
        f.templateOptions.placeholder = "Type here the desidered password";
      } else if (f.key === "password_confirm") {
        f.templateOptions.addonLeft = { class: "fas fa-key" };
        f.templateOptions.placeholder =
          "Type again the desidered password for confirmation";

        f.validators = {
          fieldMatch: {
            expression: (control) => control.value === this.model.password,
            message: "Password not matching",
          },
        };
      } else {
        f.templateOptions.addonLeft = { class: "fas fa-asterisk" };
      }
    }
    this.disclaimer = this.customization.registration_disclaimer();

    if (environment.allowTermsOfUse) {
      const privacy = this.customization.privacy_statements();

      if (privacy) {
        this.fields.push({
          className: "section-label",
          template:
            "<hr><div><strong>To protect your privacy we ask you to accept our:</strong></div>",
        });

        for (let p of privacy) {
          const field = {
            key: p.label.toLowerCase().replace(/ /gi, "_") + "_optin",
            type: "terms_of_use",
            templateOptions: {
              label: p.label,
              terms_of_use: p.text,
            },
            validators: {
              fieldMatch: {
                expression: (control) => control.value,
              },
            },
          };
          this.fields.push(field);
        }
      }
    }
  }

  register() {
    if (!this.form.valid) {
      return false;
    }
    this.loading = true;

    // Removed privacy statements from the model (not defined in backend input model)
    const cleaned_model = { ...this.model };
    for (let k in this.model) {
      if (k.endsWith("_optin")) {
        delete cleaned_model[k];
      }
    }

    this.api
      .post<string>("/auth/profile", cleaned_model, {
        validationSchema: "String",
      })
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
