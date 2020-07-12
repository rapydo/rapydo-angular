import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { environment } from "@rapydo/../environments/environment";

import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";
import { ProjectOptions } from "@app/custom.project.options";

@Component({
  templateUrl: "login.html",
})
export class LoginComponent implements OnInit {
  private returnUrl: string = "";

  public allowPasswordReset: boolean = false;
  public allowRegistration: boolean = false;
  public allowTermsOfUse: boolean = false;

  public form = new FormGroup({});
  public fields: FormlyFieldConfig[] = [];
  public model: any = {};

  public loading = false;

  public warningCard: boolean = false;
  public panelTitle: string = "Login";
  public buttonText: string = "Login";

  public askUsername: boolean = true;
  public askPassword: boolean = true;
  public askNewPassword: boolean = false;
  public askTOTP: boolean = false;

  public accountNotActive: boolean = false;

  @ViewChild("privacy_acceptance", { static: false })
  public privacy_acceptance: TemplateRef<any>;
  public modalRef: NgbModalRef;
  public terms_of_use: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService,
    private modalService: NgbModal,
    private customization: ProjectOptions,
    private api: ApiService,
    private authService: AuthService
  ) {
    this.allowRegistration = environment.allowRegistration === "true";
    this.allowPasswordReset = environment.allowPasswordReset === "true";
    this.allowTermsOfUse = environment.allowTermsOfUse === "true";
  }

  ngOnInit() {
    // reset login status
    this.authService.logout();
    this.set_form();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";

    // check for secondary route and remove it, can make router navigate fail
    const offset = this.returnUrl.lastIndexOf("(");
    if (offset >= 0) {
      this.returnUrl = this.returnUrl.slice(0, offset);
    }
  }

  private set_form() {
    this.fields = [];

    if (this.askUsername) {
      this.fields.push({
        key: "username",
        type: "input",
        templateOptions: {
          type: "email",
          label: "Username",
          placeholder: "Your username (email)",
          addonLeft: {
            class: "fa fa-envelope",
          },
          required: true,
        },
        validators: { validation: ["email"] },
      });
    }

    if (this.askPassword) {
      this.fields.push({
        key: "password",
        type: "input",
        templateOptions: {
          type: "password",
          label: "Password",
          placeholder: "Your password",
          addonLeft: {
            class: "fa fa-key",
          },
          required: true,
        },
      });
    }

    if (this.askNewPassword) {
      this.fields.push({
        key: "new_password",
        type: "input",
        templateOptions: {
          type: "password",
          label: "New password",
          addonLeft: {
            class: "fa fa-key",
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
          addonLeft: {
            class: "fa fa-key",
          },
          required: true,
        },
        validators: {
          fieldMatch: {
            expression: (control) => control.value === this.model.new_password,
            message: "The password does not match",
          },
        },
      });
    }
  }
  login() {
    if (!this.form.valid) {
      return false;
    }
    this.loading = true;
    this.authService
      .login(
        this.model.username,
        this.model.password,
        this.model.new_password,
        this.model.password_confirm
      )
      .subscribe(
        (data) => {
          this.authService.loadUser().subscribe(
            (response) => {
              this.loading = false;
              let u = this.authService.getUser();

              if (u.privacy_accepted || !this.allowTermsOfUse) {
                this.router.navigate([this.returnUrl]);
              } else {
                this.showTermsOfUse();
              }
            },
            (error) => {
              this.notify.showError(error);
              this.loading = false;
            }
          );
        },
        (error) => {
          if (error.status == 0) {
            this.notify.showError("Error: no response received from backend");
          } else if (error.status == 409) {
            this.notify.showError(error);
          } else if (error.status == 403) {
            const body = error.error;
            let userMessage = "Unrecognized response from server";

            let actions = body.actions;

            if (body === "Sorry, this account is not active") {
              this.accountNotActive = true;
            } else if (typeof actions === "undefined") {
              this.notify.showError(userMessage);
              this.notify.showError(body.errors);
            } else if (!(actions instanceof Array)) {
              this.notify.showError(userMessage);
              this.notify.showError(body.errors);
            } else {
              for (let i = 0; i < actions.length; i++) {
                let action = actions[i];
                let notyLevel = this.notify.ERROR;
                if (action == "FIRST LOGIN") {
                  this.panelTitle = "Please change your temporary password";
                  this.buttonText = "Change";
                  this.warningCard = true;
                  this.askUsername = false;
                  this.askPassword = false;
                  this.askNewPassword = true;
                  this.set_form();
                  notyLevel = this.notify.WARNING;
                } else if (action == "PASSWORD EXPIRED") {
                  this.panelTitle =
                    "Your password is expired, please change it";
                  this.buttonText = "Change";
                  this.warningCard = true;
                  this.askUsername = false;
                  this.askPassword = false;
                  this.askNewPassword = true;
                  this.set_form();
                  notyLevel = this.notify.WARNING;
                } else if (action == "TOTP") {
                  console.warn("2FA not yet implemented");
                  this.panelTitle = "Provide the verification code";
                  this.buttonText = "Authorize";
                  this.warningCard = true;
                  this.askUsername = false;
                  this.askPassword = false;
                  this.askTOTP = true;
                  this.set_form();
                  notyLevel = this.notify.WARNING;
                } else {
                  console.error("Unrecognized action: " + action);
                  this.notify.showError(userMessage);
                }
                this.notify.showAll(body.errors, notyLevel);
              }

              if (body.qr_code) {
                console.warn("2FA not yet implemented");
                // self.qr_code = body.qr_code;
              }
            }
          } else if (error.status == 404) {
            this.notify.showError(
              "Unable to login due to a server error. If this error persists please contact system administrators"
            );
          } else {
            this.notify.showError(error);
          }

          this.loading = false;
        }
      );
  }

  showTermsOfUse() {
    this.terms_of_use = this.customization.get_option("privacy_acceptance");
    if (this.terms_of_use === null) {
      this.terms_of_use = [
        {
          label: "Click here to visualize our Terms of Use",
          text: `
This is a default text, something like a lorem ipsum placeholder. <br/>
You should never visualize this text in a production environment. <br/>
If you are reading this text your terms of use test is missing in your customization component <br/>
Please add something like this to your ProjectOptions.get_option in custom.project.options.ts <br />

  if (opt == "privacy_acceptance") {
    return this.privacy_acceptance();
  }

  private privacy_acceptance() {
    return [
      {
        label: "Click here to visualize our Terms of Use",
        text: "Your Terms of Use",
      },
    ];
  }
`,
        },
      ];
    }

    this.modalRef = this.modalService.open(this.privacy_acceptance, {
      size: "lg",
    });

    this.modalRef.result.then(
      (result) => {
        this.api
          .put("profile", u.uuid, { privacy_accepted: true }, { base: "auth" })
          .subscribe(
            (data) => {
              this.authService.loadUser();
              this.router.navigate([this.returnUrl]);
            },
            (error) => {
              this.notify.showError(error);
            }
          );
      },
      (reason) => {
        this.authService.logout().subscribe((response) => {
          this.notify.showError(
            "We apologize but you are not allowed to login, as you have not accepted our Terms of Use"
          );
          this.router.navigate([""]);
        });
      }
    );
  }

  ask_activation_link() {
    this.authService.ask_activation_link(this.model.username).subscribe(
      (response: any) => {
        this.accountNotActive = false;
        this.notify.showSuccess(response);
      },
      (error) => {
        this.notify.showError(error);
      }
    );
  }
}
