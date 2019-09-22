import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
 
import { environment } from '@rapydo/../environments/environment';

import { ApiService } from '@rapydo/services/api';
import { AuthService } from '@rapydo/services/auth';
import { NotificationService} from '@rapydo/services/notification';

import { ProjectOptions } from '@app/custom.project.options';

@Component({
    templateUrl: 'register.html'
})
 
export class RegisterComponent implements OnInit {

    public allowRegistration: boolean = false;
    public registration_title: string;
    public showRegistrationForm: boolean = false;
    public registration_message: string;
    public invalid_token: boolean = false;

    private disclaimer: string;

    private form = new FormGroup({});
    private fields: FormlyFieldConfig[] = []; 
    private model:any = {}

    private loading = false;
 
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notify: NotificationService,
        private api: ApiService,
        private authService: AuthService,
        private customization: ProjectOptions) { 

            if (typeof(environment.allowRegistration) === "boolean") {
                this.allowRegistration = JSON.parse(environment.allowRegistration)
            } else {
                this.allowRegistration = (environment.allowRegistration == "true");
            }

            this.route.params.subscribe(
            params => {
                if (typeof params["token"] !== 'undefined') {

                    this.registration_title = "Validating activation token..."
                    this.api.put('profile/activate', params["token"], {}, {"base": "auth"}).subscribe(
                       response => {
                            this.invalid_token = false;
                            this.showRegistrationForm = false;
                            this.registration_title = "Registraction activated"
                            this.notify.showSuccess("User successfully activated.");
                            this.router.navigate(['app', 'login']); 
                            this.notify.extractErrors(response, this.notify.ERROR);
                            return true;

                        }, error => {
                            this.invalid_token = true;
                            this.showRegistrationForm = false;
                            this.registration_title = "Invalid activation token"
                            this.notify.extractErrors(error, this.notify.ERROR);
                            return false;
                        }
                    );
                } else {
                    this.showRegistrationForm = this.allowRegistration;
                    this.registration_title = "Register a new account"
                }
            }
        );
    }
 
    ngOnInit() {
        // retrieve custom fields from apis

        // initial disclaimer

        this.fields.push(
            {
                "key": 'name',
                "type": 'input',
                "templateOptions": {
                    "type": 'text',
                    "label": 'Name',
                    "addonLeft": {
                        "class": "fa fa-user"
                    },
                    "required": true
                }
            }
        );

        this.fields.push(
            {
                "key": 'surname',
                "type": 'input',
                "templateOptions": {
                    "type": 'text',
                    "label": 'Surname',
                    "addonLeft": {
                        "class": "fa fa-user"
                    },
                    "required": true
                }
            }
        );

        this.fields.push(
            {
                "key": 'email',
                "type": 'input',
                "templateOptions": {
                    "type": 'email',
                    "label": 'Username (email address)',
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
                    "required": true,
                    "minLength": 8
                }
            }
        );

        this.fields.push(
            {
                "key": 'password_confirmation',
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
                        "expression": (control) => control.value === this.model.password,
                        "message": "Password not matching"
                    }
                }
            }
        );

        let custom = this.customization.get_option('registration');

        if ('fields' in custom) {
            for (let i=0; i<custom['fields'].length; i++) {
                let f = custom['fields'][i];
                this.fields.push(f);
            }
        }

        if ('disclaimer' in custom) {
            this.disclaimer = custom['disclaimer'];
        } 

    }
 
    register() {
        if (!this.form.valid) {
            return false;
        }
        this.loading = true;
        this.api.post('profile', this.model,  {"base": "auth"}).subscribe(
            data => {
                this.showRegistrationForm = false;
                this.registration_title = "Account registered"
                this.registration_message = "User successfully registered. You will receive an email to confirm your registraton and activate your account";

                this.notify.showSuccess("User successfully registered");
                this.loading = false;
            },
            error => {
                this.notify.extractErrors(error, this.notify.ERROR);
                this.loading = false;
            }
        );
    }
}