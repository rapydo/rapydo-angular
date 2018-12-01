import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { NotificationService} from '../../services/notification';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
    templateUrl: 'reset.html'
})

export class ResetPasswordComponent implements OnInit {

    private token: string;
    private invalid_token: string;
    private reset_message: string;

    private step1_form = new FormGroup({});
    private step2_form = new FormGroup({});
    private step1_fields: FormlyFieldConfig[] = [];
    private step2_fields: FormlyFieldConfig[] = [];
    private model:any = {}

    private loading = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private notify: NotificationService,
        private api: ApiService,
        private authService: AuthService) {

        this.route.params.subscribe(
            params => {
                if (typeof params["token"] !== 'undefined') {

                    this.api.put('reset', params["token"], {}, {"base": "auth"}).subscribe(
                       response => {
                            this.token = params["token"]
                            this.notify.extractErrors(response, this.notify.ERROR);
                            return true;

                        }, error => {
                            this.token = undefined
                            this.invalid_token = error.errors[0];
                            this.notify.extractErrors(error, this.notify.ERROR);
                            return false;
                        }
                    );
                }
            }
        );
    }

    ngOnInit() {
        // reset login status
        this.authService.logout();

        this.step1_fields.push(
            {
                "key": 'reset_email',
                "type": 'input',
                "templateOptions": {
                    "type": 'email',
                    "label": 'Your e-mail address',
                    "addonLeft": {
                        "class": "fa fa-envelope"
                    },
                    "required": true
                },
                "validators": { "validation": ["email"]}
            }
        );

        this.step2_fields.push(
            {
                "key": 'newPwd',
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
        this.step2_fields.push(
            {
                "key": 'confirmPwd',
                "type": 'input',
                "templateOptions": {
                    "type": 'password',
                    "label": 'Confirm password',
                    "addonLeft": {
                        "class": "fa fa-key"
                    },
                    "required": true
                },
                "validators": {
                    "fieldMatch": {
                        "expression": (control) => control.value === this.model.newPwd,
                        "message": "Password not matching"
                    }
                }
            }
        );

    }

    resetRequest(): boolean {

        if (!this.step1_form.valid) {
            return false;
        }

        let data = {"reset_email": this.model["reset_email"]};
        return this.api.post('reset', data, {"base": "auth"}).subscribe(
            response => {
                this.reset_message = response.data;
                this.model = {}
                this.notify.extractErrors(response, this.notify.ERROR);
                return true;

            }, error => {
                this.notify.extractErrors(error, this.notify.ERROR);
                return false;
            }
        );
    }

    private changePassword(): boolean {

        if (!this.step2_form.valid) {
            return false;
        }

        let data = {}
        data["new_password"] = this.model["newPwd"];
        data["password_confirm"] = this.model["confirmPwd"];

        return this.api.put('reset', this.token, data, {"base": "auth"}).subscribe(
            response => {
                this.notify.showSuccess("Password successfully changed. Please login with your new password")

                this.notify.extractErrors(response, this.notify.ERROR);
                this.router.navigate(['app', 'login']);
                return true;

            }, error => {
                this.notify.extractErrors(error, this.notify.ERROR);
                return false;
            }
        );
    };

}