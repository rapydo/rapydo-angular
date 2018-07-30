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

    private allowPasswordReset: boolean = false;
    private allowRegistration: boolean = false;

    private form = new FormGroup({});
    private fields: FormlyFieldConfig[] = []; 
    private model:any = {}

    private loading = false;
    private returnUrl: string = "";

    private account_not_active:boolean = false;

    @ViewChild('privacy_acceptance') public privacy_acceptance: TemplateRef<any>;
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

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
 
    login() {
        if (!this.form.valid) {
            return false;
        }
        this.loading = true;
        this.authService.login(this.model.username, this.model.password)
            .subscribe(
                data => {

                    this.authService.loadUser().subscribe(
                        response => {
                            this.loading = false;
                            let u = this.authService.getUser()
                            if (u.hasOwnProperty('privacy_accepted') && !u.privacy_accepted) {
                                this.terms_of_use = this.customization.get_option('privacy_acceptance');
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
                        //$log.warn("Auth raised errors", response);
                        this.notify.extractErrors(error, this.notify.ERROR);
                        /*window.alert(error.error.Response.errors[0])*/

                    } else if (error.status == 403) {
                        //$log.warn("Auth not completed", response);

                        // TO BE REIMPLEMENTED
                        console.log("2FA not yet implemented");
/*
                        // self.userMessage = "Unrecognized response from server"
                        self.userMessage = ""

                        if (typeof response.Response.data.actions === 'undefined') {
                            noty.showError(self.userMessage)
                            noty.showAll(response.Response.errors, noty.ERROR);
                        } else if (! (response.Response.data.actions instanceof Array)) {
                            noty.showError(self.userMessage)
                            noty.showAll(response.Response.errors, noty.ERROR) 
                        // } else if (typeof response.Response.data.token === 'undefined') {
                        //     noty.showError(self.userMessage)
                        //     noty.showAll(response.Response.errors, noty.ERROR);
                        } else {
                            let originalUerMessage = self.userMessage
                            // self.userMessage = response.Response.errors[0];

                            // let temp_token = response.Response.data.token
                            let actions = response.Response.data.actions

                            for (let i=0; i<actions.length; i++) {
                                let action = actions[i];
                                let notyLevel = noty.ERROR;
                                if (action == 'FIRST LOGIN') {
                                    self.panelTitle = "Please change your temporary password"
                                    self.buttonText = "Change"
                                    self.askUsername = false;
                                    self.askPassword = false;
                                    self.askNewPassword = true;
                                    notyLevel = noty.WARNING;

                                } else if (action == 'PASSWORD EXPIRED') {
                                    self.panelTitle = "Your password is expired, please change it"
                                    self.buttonText = "Change"
                                    self.askUsername = false;
                                    self.askPassword = false;
                                    self.askNewPassword = true;
                                    notyLevel = noty.WARNING;

                                } else if (action == 'TOTP') {
                                    self.panelTitle = "Provide the verification code"
                                    self.buttonText = "Authorize"
                                    self.askUsername = false;
                                    self.askPassword = false;
                                    self.askTOTP = true
                                    notyLevel = noty.WARNING;
                                    
                                } else {
                                    self.userMessage = originalUerMessage;
                                    noty.showError(self.userMessage)
                                }
                                // noty.showAll(response.Response.errors, notyLevel);

                            }

                            if (response.Response.data.qr_code) {

                                self.qr_code = response.Response.data.qr_code;

                            }
                        }
*/
                    } else {
                        if (error.error.Response.errors[0] == "Sorry, this account is not active") {
                            this.account_not_active = true;

                        }
                        this.notify.extractErrors(error.error.Response, this.notify.ERROR);
                    }

                    this.loading = false;
                });
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