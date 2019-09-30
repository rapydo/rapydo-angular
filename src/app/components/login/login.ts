import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
 
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { NotificationService} from '/rapydo/src/app/services/notification';
import { ProjectOptions } from '/app/frontend/app/custom.project.options';
 
@Component({
    templateUrl: 'login.html'
})
 
export class LoginComponent implements OnInit {

    private returnUrl: string = "";

    public allowPasswordReset: boolean = false;
    public allowRegistration: boolean = false;

    public form = new FormGroup({});
    public fields: FormlyFieldConfig[] = []; 
    public model:any = {}

    public loading = false;

    public warningCard:boolean = false;
    public panelTitle:string = "Login";
    public buttonText:string = "Login";

    public askUsername:boolean = true;
    public askPassword:boolean = true;
    public askNewPassword:boolean = false;
    public askTOTP:boolean = false;

    public account_not_active:boolean = false;

    @ViewChild('privacy_acceptance', { static: false }) public privacy_acceptance: TemplateRef<any>;
    protected modalRef: NgbModalRef;
    private terms_of_use: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notify: NotificationService,
        private modalService: NgbModal,
        private customization: ProjectOptions,
        private api: ApiService,
        private authService: AuthService) { 

            if (typeof(process.env.allowRegistration) === "boolean") {
                this.allowRegistration = JSON.parse(process.env.allowRegistration)
            } else {
                this.allowRegistration = (process.env.allowRegistration == "true");
            }

            if (typeof(process.env.allowPasswordReset) === "boolean") {
                this.allowPasswordReset = JSON.parse(process.env.allowPasswordReset)
            } else {
                this.allowPasswordReset = (process.env.allowPasswordReset == "true");
            }

    }

 
    ngOnInit() {
        // reset login status
        this.authService.logout();
        this.set_form();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        // check for secondary route and remove it, can make router navigate fail
        const offset = this.returnUrl.lastIndexOf('(');
        if (offset >= 0) { 
            this.returnUrl = this.returnUrl.slice(0, offset);
        }
    }
 
    private set_form() {

        this.fields = []; 

        if (this.askUsername) {
            this.fields.push(
                {
                    "key": 'username',
                    "type": 'input',
                    "templateOptions": {
                        "type": 'email',
                        "label": 'Username',
                        "addonLeft": {
                            "class": "fa fa-envelope"
                        },
                        "required": true
                    },
                    "validators": { "validation": ["email"]}
                }
            );
        }

        if (this.askPassword) {
            this.fields.push(
                {
                    "key": 'password',
                    "type": 'input',
                    "templateOptions": {
                        "type": 'password',
                        "label": 'Password',
                        "addonLeft": {
                            "class": "fa fa-key"
                        },
                        "required": true
                    }
                }
            );
        }

        if (this.askNewPassword) {

            this.fields.push(
                {
                    "key": 'new_password',
                    "type": 'input',
                    "templateOptions": {
                        "type": 'password',
                        "label": 'New password',
                        "addonLeft": {
                            "class": "fa fa-key"
                        },
                        "required": true,
                        "minLength": 8
                    }
                }
            );
            this.fields.push(
                {
                    "key": 'password_confirm',
                    "type": 'input',
                    "templateOptions": {
                        "type": 'password',
                        "label": 'Password confirmation',
                        "addonLeft": {
                            "class": "fa fa-key"
                        },
                        "required": true
                    },
                    "validators": {
                      "fieldMatch": {
                        "expression": (control) => control.value === this.model.new_password,
                        "message": "The password does not match"
                      }
                    }
                }
            );

        }
    }
    login() {
        if (!this.form.valid) {
            return false;
        }
        this.loading = true;
        this.authService.login(this.model.username, this.model.password, this.model.new_password, this.model.password_confirm).subscribe(
            data => {

                this.authService.loadUser().subscribe(
                    response => {
                        this.loading = false;
                        let u = this.authService.getUser()
                        if (u.hasOwnProperty('privacy_accepted') && !u.privacy_accepted) {
                            this.terms_of_use = this.customization.get_option('privacy_acceptance');
                            if (this.terms_of_use !== null) {
                                this.modalRef = this.modalService.open(this.privacy_acceptance, {size: 'lg'});
                                this.modalRef.result.then((result) => {
                                    this.api.put('profile', u.id, {'privacy_accepted': true}, {"base": "auth"}).subscribe(
                                        data => {
                                            this.router.navigate([this.returnUrl]);
                                        },
                                        error => {
                                            this.notify.extractErrors(error, this.notify.ERROR);
                                        }
                                    );
                                }, (reason) => {
                                    this.authService.logout().subscribe(
                                        response =>  {
                                            this.notify.showError("We apologize but you are not allowed to login, since you don't accepted our Terms of Use");
                                            this.router.navigate(['']);
                                        }
                                    );
                                });
                            } else {
                                this.router.navigate([this.returnUrl]);
                            }
                        } else {
                            this.router.navigate([this.returnUrl]);
                        }

                        this.notify.extractErrors(response, this.notify.WARNING);
                    }, 
                    error => {
                        if (error.status == 0) {
                            this.router.navigate(["/offline"]);

                        } else {
                            this.notify.extractErrors(error, this.notify.ERROR);
                        }
                        this.loading = false;
                    }
                );
            },
            error => {
                if (error.status == 0) {
                    this.router.navigate(["/offline"]);

                } else if (error.status == 409) {
                    console.log("409 !? ");
                    console.log(error);
                    this.notify.extractErrors(error.error.Response, this.notify.ERROR);

                } else if (error.status == 403) {

                    let userMessage = "Unrecognized response from server"

                    let actions = error.error.Response.data.actions
                    if (typeof actions === 'undefined') {
                        this.notify.showError(userMessage)
                        this.notify.showAll(error.error.Response.errors, this.notify.ERROR);
                    } else if (! (actions instanceof Array)) {
                        this.notify.showError(userMessage)
                        this.notify.showAll(error.error.Response.errors, this.notify.ERROR);
                    } else {

                        for (let i=0; i<actions.length; i++) {
                            let action = actions[i];
                            let notyLevel = this.notify.ERROR;
                            if (action == 'FIRST LOGIN') {
                                this.panelTitle = "Please change your temporary password"
                                this.buttonText = "Change"
                                this.warningCard = true;
                                this.askUsername = false;
                                this.askPassword = false;
                                this.askNewPassword = true;
                                this.set_form();
                                notyLevel = this.notify.WARNING;

                            } else if (action == 'PASSWORD EXPIRED') {
                                this.panelTitle = "Your password is expired, please change it"
                                this.buttonText = "Change"
                                this.warningCard = true;
                                this.askUsername = false;
                                this.askPassword = false;
                                this.askNewPassword = true;
                                this.set_form();
                                notyLevel = this.notify.WARNING;

                            } else if (action == 'TOTP') {
                                console.log("2FA not yet implemented");
                                this.panelTitle = "Provide the verification code"
                                this.buttonText = "Authorize"
                                this.warningCard = true;
                                this.askUsername = false;
                                this.askPassword = false;
                                this.askTOTP = true;
                                this.set_form();
                                notyLevel = this.notify.WARNING;
                                
                            } else {
                                console.log("Unrecognized action: " + action);
                                this.notify.showError(userMessage)
                            }
                            this.notify.showAll(error.error.Response.errors, notyLevel);

                        }

                        if (error.error.Response.data.qr_code) {

                            console.log("2FA not yet implemented");
                            // self.qr_code = error.error.Response.data.qr_code;

                        }
                    }

                } else if (error.status == 404) {
                    this.notify.showError("Unable to login due to a server error. If this error persists please contact system administrators");

                } else {
                    if (error.error && error.error.Response) {
                        if (error.error.Response.errors[0] == "Sorry, this account is not active") {
                            this.account_not_active = true;
                        }
                    }
                    this.notify.extractErrors(error.error.Response, this.notify.ERROR);
                }

                this.loading = false;
            }
        );
    }

    ask_activation_link() {

        this.authService.ask_activation_link(this.model.username).subscribe(
            (response:any) => {
                this.account_not_active = false;
                this.notify.showSuccess(response.Response.data);
                this.notify.extractErrors(response, this.notify.WARNING);
            }, error => {
                this.notify.extractErrors(error.error.Response, this.notify.ERROR);
            }
        );

    }
}