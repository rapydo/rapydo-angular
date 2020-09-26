import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, finalize } from "rxjs/operators";
import { of, throwError } from "rxjs";
import { Subject } from "rxjs";

import { User, Session, Group } from "@rapydo/types";
import { environment } from "@rapydo/../environments/environment";
import { ApiService } from "@rapydo/services/api";
import { NotificationService } from "@rapydo/services/notification";

@Injectable()
export class AuthService {
  userChanged = new Subject<any>();

  readonly LOGGED_IN = "logged-in";
  readonly LOGGED_OUT = "logged-out";

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private notify: NotificationService
  ) {}

  public login(
    username: string,
    password: string,
    new_password: string = null,
    password_confirm: string = null
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

    return this.http
      .post<any>(environment.backendURI + "/auth/login", data)
      .pipe(
        map((response) => {
          this.clean_localstorage();
          this.setToken(JSON.stringify(response));
          return response;
        })
      );
  }

  public logout() {
    return this.http.get<any>(environment.backendURI + "/auth/logout").pipe(
      finalize(() => {
        this.removeToken();
      })
    );
  }

  public change_password(data) {
    return this.http.put(environment.backendURI + "/auth/profile", data).pipe(
      map((response) => {
        this.removeToken();

        return response;
      })
    );
  }

  public ask_activation_link(username) {
    const data = { username };
    return this.http.post(
      environment.backendURI + "/auth/profile/activate",
      data
    );
  }

  public loadUser() {
    return this.http.get<any>(environment.backendURI + "/auth/profile").pipe(
      map((response) => {
        this.setUser(JSON.stringify(response));

        return response;
      }),
      catchError((error) => {
        this.notify.showError(error);
        return null;
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
    let token = this.getToken();
    if (!token) {
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

  private setUser(user: any) {
    localStorage.setItem("currentUser", user);
    // this.userChanged.emit(this.LOGGED_IN);
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
