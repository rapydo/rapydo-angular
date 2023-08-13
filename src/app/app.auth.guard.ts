import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { of, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "@rapydo/services/auth";
import { ApiService } from "@rapydo/services/api";
import { environment } from "@rapydo/../environments/environment";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public auth: AuthService,
    public api: ApiService,
    public router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const expectedRoles = route.data.roles;

    if (!environment.authEnabled) {
      this.router.navigate(["app/404"]);
      return of(false);
    }

    return this.auth.isAuthenticated().pipe(
      map((response) => {
        // User is authenticated, verify roles
        if (response) {
          return this.auth.hasRole(expectedRoles);
        }

        if (this.api.is_online()) {
          this.router.navigate(["app/login"], {
            queryParams: { returnUrl: state.url },
          });
        } else {
          // this.router.navigate(["offline"]);
        }

        return false;
      }),
    );
  }
}
