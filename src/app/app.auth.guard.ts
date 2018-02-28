
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router'
import { AuthService } from './app.auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	
	constructor(public auth: AuthService, public router: Router) {}

	canActivate(route: ActivatedRouteSnapshot): boolean {

        const expectedRole = route.data.role;

		if (!this.auth.isAuthenticated()) {
            window.alert("You are not authorized");
            this.router.navigate(['new/login']);
            return false;
        } else if (!this.auth.hasRole(expectedRole)) {
            window.alert("You are not authorized - missing role");
            return false;
		} else {
            return true;

		}
	}
}