import { Injectable } from "@angular/core";
import { catchError, map, finalize } from "rxjs/operators";
import { of, throwError, Subject, Observable } from "rxjs";

import { User, Session, Group } from "@rapydo/types";
import { environment } from "@rapydo/../environments/environment";
import { ApiService } from "@rapydo/services/api";
import { NotificationService } from "@rapydo/services/notification";

@Injectable()
export class AuthService {
  userChanged = new Subject<string>();

  readonly LOGGED_IN = "logged-in";
  readonly LOGGED_OUT = "logged-out";

  constructor(private api: ApiService, private notify: NotificationService) {}

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
          this.clean_localstorage();
          this.setToken(JSON.stringify(response));
          return response;
        })
      );
  }

  public logout() {
    return this.api.get<any>("/auth/logout", {}, { redirect: false }).pipe(
      finalize(() => {
        this.removeToken();
      })
    );
  }

  public change_password(data) {
    return this.api
      .put("/auth/profile", data, { rawError: true, redirect: false })
      .pipe(
        map((response) => {
          this.removeToken();

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
          this.setUser(response);

          return response;
        }),
        catchError((error) => {
          this.notify.showError(error);
          return throwError(error);
        })
      );
  }

  public getUser(): User {
    return JSON.parse(localStorage.getItem("currentUser"));
  }

  public getToken() {
    return JSON.parse(localStorage.getItem("token"));
  }

  public isAuthenticated() {
    if (!this.getToken()) {
      return of(false);
    }

    // {validationSchema: "Boolean"}
    return this.api.get<boolean>("/auth/status").pipe(
      map((response) => {
        return of(true);
      }),
      catchError((error, caught) => {
        /* istanbul ignore else */
        if (this.api.is_online()) {
          this.removeToken();
        }
        return of(false);
      })
    );
  }

  public hasRole(expectedRoles: string[]): boolean {
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    let user = this.getUser();

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

  private setUser(user: User) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    this.userChanged.next(this.LOGGED_IN);
  }

  private setToken(token: string) {
    localStorage.setItem("token", token);
  }

  private removeToken() {
    this.clean_localstorage();
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    // this.userChanged.emit(this.LOGGED_OUT);
    this.userChanged.next(this.LOGGED_OUT);
  }

  private clean_localstorage() {
    // Cleaning up the localStorage from data from the previous session
    Object.keys(localStorage).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
