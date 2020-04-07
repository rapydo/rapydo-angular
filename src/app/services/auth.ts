import { Injectable } from '@angular/core';
// import { Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Subject } from 'rxjs'
import { ApiService } from './api';

import { environment } from '@rapydo/../environments/environment';
import { NotificationService } from '@rapydo/services/notification';

@Injectable()
export class AuthService {

  // @Output() userChanged: EventEmitter<string> = new EventEmitter<string>();
  // userChanged: EventEmitter<string> = new EventEmitter<string>();

  userChanged = new Subject<any>();


  readonly LOGGED_IN = "logged-in";
  readonly LOGGED_OUT = "logged-out";

  constructor(private http: HttpClient, private api: ApiService, private notification: NotificationService) { }

  public login(username: string, password: string, new_password:string=undefined, password_confirm:string=undefined) {
    let data = {
      username: username,
      password: password,
      new_password: new_password,
      password_confirm: password_confirm,
    };

    return this.http.post<any>(environment.authApiUrl + '/login', data).pipe(map(
      response => {
        if (!response) return response;

        if (environment.WRAP_RESPONSE == '1') {
          response = response.Response.data.token;
        }

        this.clean_localstorage();
        this.setToken(JSON.stringify(response));
        return response;
      }
    ));
  }

  public logout() {
    return this.http.get<any>(environment.authApiUrl + '/logout').pipe(map(
      response => {
        this.removeToken();

        return response;
      },
      err => {
        this.removeToken();
        return err;
      }

    ));
  }

  public change_password(data) {
    return this.http.put(environment.authApiUrl + '/profile', data).pipe(map(
      response => {
          this.removeToken()

          return response;

      },
      error => {
        return throwError(error);
      }
    ));
  }

  public ask_activation_link(username) {
    let data = {"username": username}
    return this.http.post(environment.authApiUrl + '/profile/activate', data).pipe(map(
      response => {
          return response;
      },
      error => {
        return error;
      }
    ));
  }

  public loadUser() {

    return this.http.get<any>(environment.authApiUrl + '/profile').pipe(map(
      response => {
        if (!response) return response

        if (environment.WRAP_RESPONSE == '1') {
          response = response.Response.data;
        }

          // Conversion roles list into roles dict to simplify checks
/*          let roles_dict = {}
          for (let i=0; i<response.roles.length; i++) {
            let r = response.roles[i];
            roles_dict[r] = r
          }
          response.roles = roles_dict
*/
        this.setUser(JSON.stringify(response));

        return response;
      }, error => {
        if (environment.WRAP_RESPONSE == '1') {
          this.notification.showError(error.Response.errors);
        } else {
          this.notification.showError(error);
        }

        return null;
      }
    ));
  }

  public getUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }


  public getToken() {
    return JSON.parse(localStorage.getItem('token'))
  }
  public isAuthenticated() {

    let token = this.getToken();
    if (!token) {
      return of(false);
    }

    let opt =  {"base": "auth", "rawResponse": true};
    return this.api.get('profile', "", [], opt).pipe(
      map(response => {
        return of(true);
      }),
      catchError((error, caught) => {
        if (this.api.is_online()) {
          this.removeToken();
        }
        return of(false); 
      })
    );
  }

  public hasRole(expectedRoles: string[]): boolean {

    if (!expectedRoles || expectedRoles.length == 0) {
      return true;
    }

    let user = this.getUser();
    if (user == null) {
      return false;
    }

    for (let i=0; i<expectedRoles.length; i++) {
      if (expectedRoles[i] in user.roles) {
        return true;
      }
    }
    this.notification.showError("Permission denied: you are not authorized to access this page")
    return false;
  }

  private setUser(user: any) {
    localStorage.setItem('currentUser', user);
    // this.userChanged.emit(this.LOGGED_IN);
    this.userChanged.next(this.LOGGED_IN);
  }

  private setToken(token: string) {

    localStorage.setItem('token', token);

  }

  private removeToken() {
    this.clean_localstorage();
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    // this.userChanged.emit(this.LOGGED_OUT);
    this.userChanged.next(this.LOGGED_OUT);
  }

  private clean_localstorage() {
    // Cleaning up the localStorage from data from the previous session
    Object.keys(localStorage).forEach(
      key => {
        localStorage.removeItem(key)
      }
    );
  }

}

