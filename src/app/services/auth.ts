import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ApiService } from './api';
import 'rxjs/add/operator/map';

import { NotificationService } from '/rapydo/src/app/services/notification';

@Injectable()
export class AuthService {

	// @Output() userChanged: EventEmitter<string> = new EventEmitter<string>();
	userChanged: EventEmitter<string> = new EventEmitter<string>();

	readonly LOGGED_IN = "logged-in";
	readonly LOGGED_OUT = "logged-out";

	constructor(private http: HttpClient, private api: ApiService, private notification: NotificationService) { }

	public login(username: string, password: string) {
		let data = {username: username, password: password};
		return this.http.post<any>(process.env.authApiUrl + '/login', data).map(
			response => {
				if (response && response.Response && response.Response.data && response.Response.data.token) {
					this.setToken(JSON.stringify(response.Response.data.token))
				}

				return response;
			});
	}

	public logout() {
		return this.http.get<any>(process.env.authApiUrl + '/logout').map(
			response => {
				this.removeToken();

				return response;
			},
			err => {
				this.removeToken();
				return err;
			}

		);
	}

	public change_password(data) {
		return this.http.put(process.env.authApiUrl + '/profile', data).map(
			response => {
    			this.removeToken()

    			return response;

			},
			error => {

				return error;
			}
		);
	}

	public loadUser() {

		return this.http.get<any>(process.env.authApiUrl + '/profile').map(
			response => {
				if (response && response.Response && response.Response.data) {
					this.setUser(JSON.stringify(response.Response.data));
				}

				return response;
			}, error => {
				console.log("Unable to load user")

				return null;
			}
		);
	}

	public removeToken() {
		localStorage.removeItem('token');
		localStorage.removeItem('currentUser');
		this.userChanged.emit(this.LOGGED_OUT);
	}

	public setUser(user: any) {
		localStorage.setItem('currentUser', user);
		this.userChanged.emit(this.LOGGED_IN);
	}
	public getUser() {
		return JSON.parse(localStorage.getItem('currentUser'))
	}

	public setToken(token: string) {
		localStorage.setItem('token', token);
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
			/*console.log("no role required")*/
			return true;
		}

        let user = this.getUser();

        for (let i=0; i<expectedRoles.length; i++) {
	        if (expectedRoles[i] in user.roles) {
				// console.log("ok " + expectedRoles + ", you are authorized")
		        return true
		    }
    	}
        // console.log("You are not authorized - missing roles: " + expectedRoles);
        this.notification.showError("Permission denied: you are not authorized to access this page")
        return false;
    }
}

