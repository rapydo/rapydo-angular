import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
 
import { AuthService } from './app.auth.service';
 
@Component({
    templateUrl: 'login.component.html'
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

/*                    this.router.navigate([this.returnUrl]);*/

                    this.authService.loadUser().subscribe(
                        data => {
                            this.router.navigate([this.returnUrl]);
                        }, 
                        error => {
                            window.alert(error.error.Response.errors[0])
                            this.loading = false;
                        }
                    );
                },
                error => {
                    window.alert(error.error.Response.errors[0])
                    this.loading = false;
                });
    }
}