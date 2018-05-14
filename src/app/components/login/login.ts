import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
 
import { AuthService } from './services/auth';
 
@Component({
    templateUrl: 'login.html'
})
 
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
 
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService) { 

            this.returnUrl = "/new/test";
    }
 
    ngOnInit() {
        // reset login status
        this.authService.logout();
 
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
 
    login() {
        this.loading = true;
        this.authService.login(this.model.username, this.model.password)
            .subscribe(
                data => {

                    this.authService.loadUser().subscribe(
                        data => {
                            this.router.navigate([this.returnUrl]);
                        }, 
                        error => {
                            if (error.status == 0) {
                                this.router.navigate(["/offline"]);

                            } else {
                                window.alert(error.error.Response.errors[0])
                            }
                            this.loading = false;
                        }
                    );
                },
                error => {
                    if (error.status == 0) {
                        console.log("offline");
                        this.router.navigate(["/offline"]);

                    } else if (error.status == 409) {
                        //$log.warn("Auth raised errors", response);
                        window.alert(error.error.Response.errors[0])

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
                            var originalUerMessage = self.userMessage
                            // self.userMessage = response.Response.errors[0];

                            // var temp_token = response.Response.data.token
                            var actions = response.Response.data.actions

                            for (var i=0; i<actions.length; i++) {
                                var action = actions[i];
                                var notyLevel = noty.ERROR;
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
                        window.alert(error.error.Response.errors[0])
                    }

                    this.loading = false;
                });
    }
}