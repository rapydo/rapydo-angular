import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
 
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

    model: any = {};
    loading = false;
 
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
                            console.log(response);
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
    }

    resetRequest(form: any): boolean {

        if (form.valid) {
            
            var data = {"reset_email": form.value["reset_email"]};
            return this.api.post('reset', data, {"base": "auth"}).subscribe(
                response => {
                    console.log(response);
                    this.reset_message = response.data;
                    this.notify.extractErrors(response, this.notify.ERROR);
                    return true;

                }, error => {
                    this.notify.extractErrors(error, this.notify.ERROR);
                    return false;
                }
            );

        } else {

            if (form.value["reset_email"] == "") {
                this.notify.showError("Please provide your reset email");
            } else {
                this.notify.showError("Invalid request...");
                console.log(form);
            }
            return false;
        }
    }

    private changePassword(form: any): boolean {

        if (form.valid) {
            if (form.value["newPwd"] != form.value["confirmPwd"]) {
                this.notify.showError("New password does not match with confirmation");
                return false;
            }

            var data = {}
            data["new_password"] = form.value["newPwd"];
            data["password_confirm"] = form.value["confirmPwd"];

            return this.api.put('reset', this.token, data, {"base": "auth"}).subscribe(
                response => {
                    console.log(response);
                    this.notify.showSuccess("Password successfully changed. Please login with your new password")

                    this.notify.extractErrors(response, this.notify.ERROR);
                    this.router.navigate(['app', 'login']);
                    return true;

                }, error => {
                    this.notify.extractErrors(error, this.notify.ERROR);
                    return false;
                }
            );
        } else {
            console.log(form);
            return false;
        }
    };
    
}