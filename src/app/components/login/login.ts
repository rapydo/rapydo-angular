import {
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { environment } from "@rapydo/../environments/environment";

import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { User } from "@rapydo/types";
import { NotificationService } from "@rapydo/services/notification";
import { ProjectOptions } from "@app/customization";

@Component({
  templateUrl: "login.html",
})
export class LoginComponent implements OnInit {
  private returnUrl: string = "";

  public allowPasswordReset: boolean = false;
  public allowRegistration: boolean = false;

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

  public isBrowser = isPlatformBrowser(this.platformId);
  public isServer = isPlatformServer(this.platformId);

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService,
    private modalService: NgbModal,
    private customization: ProjectOptions,
    private api: ApiService,
    private auth: AuthService
  ) {
    this.allowRegistration = environment.allowRegistration;
    this.allowPasswordReset = environment.allowPasswordReset;

    const user = this.auth.getUser();
    if (user != null) {
      this.auth.logout().subscribe((response) => {
        console.log("Forced logout");
      });
    }
  }

  ngOnInit() {
    this.set_form();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";

    // check for secondary route and remove it, can make router navigate fail
    const offset = this.returnUrl.lastIndexOf("(");
    /* istanbul ignore if */
    if (offset >= 0) {
      this.returnUrl = this.returnUrl.slice(0, offset);
    }
  }

  private goto_url(raw_url: string) {
    // this.router.parseUrl(this.returnUrl).queryParams[key] || '';
    // this will convert the url string into an UrlTree
    // This conversion allows for redirect to urls with query parameters
    // e.g. /app/myroute?param1=val1
    const url = this.router.parseUrl(raw_url);
    this.router.navigateByUrl(url);

    // This is the previous version queryParameters non-aware
    // this.router.navigate([raw_url]);
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
            class: "fas fa-envelope",
          },
          required: true,
        },
        validators: { validation: ["email"] },
      });
    }

    if (this.askPassword) {
      this.fields.push({
        key: "password",
        type: "password",
        templateOptions: {
          // type: "password",
          label: "Password",
          placeholder: "Your password",
          addonLeft: {
            class: "fas fa-key",
          },
          required: true,
        },
      });
    }

    if (this.askNewPassword) {
      this.fields.push({
        key: "new_password",
        type: "password",
        templateOptions: {
          // type: "password",
          label: "New password",
          placeholder: "Your new password",
          addonLeft: {
            class: "fas fa-key",
          },
          required: true,
          minLength: environment.minPasswordLength,
        },
      });
      this.fields.push({
        key: "password_confirm",
        type: "password",
        templateOptions: {
          // type: "password",
          label: "Password confirmation",
          placeholder: "Confirm your new password",
          addonLeft: {
            class: "fas fa-key",
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
    this.auth
      .login(
        this.model.username,
        this.model.password,
        this.model.new_password,
        this.model.password_confirm
      )
      .subscribe(
        (data) => {
          this.auth.loadUser().subscribe(
            (response) => {
              this.loading = false;
              let u: User = this.auth.getUser();

              if (u.privacy_accepted || !environment.allowTermsOfUse) {
                this.goto_url(this.returnUrl);
              } else {
                this.showTermsOfUse(u);
              }
            },
            (error) => {
              this.notify.showError(error);
              this.loading = false;
            }
          );
        },
        (error) => {
          if (error.status === 403) {
            const body = error.error;

            if (body === "Sorry, this account is not active") {
              this.accountNotActive = true;
            } else if (!body.actions || body.actions.length === 0) {
              this.notify.showError("Unrecognized response from server");
              if (body.errors) {
                this.notify.showError(body.errors);
              }
            } else {
              for (let action of body.actions) {
                if (action === "FIRST LOGIN") {
                  this.panelTitle = "Please change your temporary password";
                  this.buttonText = "Change";
                  this.warningCard = true;
                  this.askUsername = false;
                  this.askPassword = false;
                  this.askNewPassword = true;
                  this.set_form();
                  this.notify.showWarning(body.errors);
                } else if (action === "PASSWORD EXPIRED") {
                  this.panelTitle =
                    "Your password is expired, please change it";
                  this.buttonText = "Change";
                  this.warningCard = true;
                  this.askUsername = false;
                  this.askPassword = false;
                  this.askNewPassword = true;
                  this.set_form();
                  this.notify.showWarning(body.errors);
                } else if (action === "TOTP") {
                  console.warn("2FA not yet implemented");
                  this.panelTitle = "Provide the verification code";
                  this.buttonText = "Authorize";
                  this.warningCard = true;
                  this.askUsername = false;
                  this.askPassword = false;
                  this.askTOTP = true;
                  this.set_form();
                  this.notify.showWarning(body.errors);
                } else {
                  console.error("Unrecognized action: " + action);
                  this.notify.showError("Unrecognized response from server");
                }
              }

              if (body.qr_code) {
                console.warn("2FA not yet implemented");
                // self.qr_code = body.qr_code;
              }
            }
          } else if (error.status === 404) {
            this.notify.showError(
              "Unable to login due to a server error. If this error persists please contact system administrators"
            );
          } else if (error.status === 502) {
            this.notify.showError(
              "The page you are looking for is currently unreachable",
              "Resource unavailable"
            );
          } else {
            this.notify.showError(error);
          }

          this.loading = false;
        }
      );
  }

  showTermsOfUse(user: User) {
    this.terms_of_use = this.customization.privacy_statements();

    this.modalRef = this.modalService.open(this.privacy_acceptance, {
      size: "lg",
    });

    this.modalRef.result.then(
      (result) => {
        this.api.patch("/auth/profile", { privacy_accepted: true }).subscribe(
          (data) => {
            this.auth.loadUser();
            this.goto_url(this.returnUrl);
          },
          (error) => {
            this.notify.showError(error);
          }
        );
      },
      (reason) => {
        this.auth.logout().subscribe((response) => {
          this.notify.showError(
            "We apologize but you are not allowed to login, as you have not accepted our Terms of Use"
          );
          this.router.navigate([""]);
        });
      }
    );
  }

  ask_activation_link() {
    this.auth.ask_activation_link(this.model.username).subscribe(
      (response) => {
        this.accountNotActive = false;
        this.notify.showSuccess(response);
      },
      (error) => {
        this.notify.showError(error);
      }
    );
  }
}
