import { Injectable } from "@angular/core";
import { catchError, map, finalize } from "rxjs/operators";
import { of, throwError, Observable } from "rxjs";

import { User } from "@rapydo/types";
import { environment } from "@rapydo/../environments/environment";
import { LocalStorageService } from "@rapydo/services/localstorage";
import { ApiService } from "@rapydo/services/api";
import { NotificationService } from "@rapydo/services/notification";

@Injectable()
export class AuthService {
  constructor(
    private local_storage: LocalStorageService,
    private api: ApiService,
    private notify: NotificationService
  ) {}

  public login(
    username: string,
    password: string,
    new_password: string = null,
    password_confirm: string = null,
    totp_code: string = null
  ) {
    let data;
    if (new_password !== null && password_confirm !== null) {
      data = {
        username,
        password,
        new_password,
        password_confirm,
      };
    } else {
      data = {
        username,
        password,
      };
    }
    if (totp_code !== null) {
      data["totp_code"] = totp_code;
    }

    return this.api
      .post<string>("/auth/login", data, { rawError: true, redirect: false })
      .pipe(
        map((response) => {
          this.local_storage.clean();
          this.local_storage.setToken(response);
          return response;
        })
      );
  }

  public logout() {
    return this.api.get<any>("/auth/logout", {}, { redirect: false }).pipe(
      finalize(() => {
        this.local_storage.removeToken();
      })
    );
  }

  public change_password(data) {
    return this.api
      .put("/auth/profile", data, { rawError: true, redirect: false })
      .pipe(
        map((response) => {
          this.local_storage.removeToken();

          return response;
        })
      );
  }

  public ask_activation_link(username) {
    const data = { username };
    return this.api.post("/auth/profile/activate", data);
  }

  public loadUser(): Observable<User> {
    return this.api
      .get<User>("/auth/profile", {}, { validationSchema: "User" })
      .pipe(
        map((response: User) => {
          this.local_storage.setUser(response);

          return response;
        }),
        catchError((error) => {
          this.notify.showError(error);
          return throwError(error);
        })
      );
  }

  public getToken(): string {
    return this.local_storage.getToken();
  }
  public getUser(): User {
    return this.local_storage.getUser();
  }

  public isAuthenticated(login_redirect: boolean = true) {
    if (!environment.authEnabled) {
      return of(false);
    }

    if (!this.local_storage.getToken()) {
      return of(false);
    }

    // {validationSchema: "Boolean"}
    return this.api
      .get<boolean>("/auth/status", {}, { redirect: login_redirect })
      .pipe(
        map((response) => {
          return of(true);
        }),
        catchError((error, caught) => {
          /* istanbul ignore else */
          if (this.api.is_online()) {
            this.local_storage.removeToken();
          }
          return of(false);
        })
      );
  }

  // public printSecurityEvents() {
  //   if (Math.floor(Math.random() * 2) == 0) {
  //     this.notify.showWarning("...");
  //   }
  // }

  public hasRole(expectedRoles: string[]): boolean {
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    let user = this.local_storage.getUser();

    /* istanbul ignore if */
    if (user === null) {
      return false;
    }

    for (let i = 0; i < expectedRoles.length; i++) {
      if (expectedRoles[i] in user.roles) {
        return true;
      }
    }
    this.notify.showError(
      "Permission denied: you are not authorized to access this page"
    );
    return false;
  }
}
