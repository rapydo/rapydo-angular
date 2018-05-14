
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router'
import { catchError, map } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { of } from 'rxjs/observable/of';
import { AuthService } from './services/auth';
import { ApiService } from './services/api';

@Injectable()
export class AuthGuard implements CanActivate {
	
	constructor(
        public auth: AuthService,
        public api: ApiService,
        public router: Router
     ) {}

	canActivate(route: ActivatedRouteSnapshot): boolean {

        const expectedRole = route.data.role;

/*        if (!this.api.is_online()) {

            console.log("Api offline");
            this.router.navigate(['offline']);
            return false;
        }*/

		return this.auth.isAuthenticated().pipe(
            map(response => {
                // User is authenticated, verify roles
                if (response) return this.auth.hasRole(expectedRole);

                if (this.api.is_online()) {
                    this.router.navigate(['new/login']);
                } else {
                    this.router.navigate(['offline']);
                }

                return false;
            })
        );
    }
}