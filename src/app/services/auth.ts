import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ApiService } from './api';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

	@Output() userChanged: EventEmitter<string> = new EventEmitter<string>();

	readonly LOGGED_IN = "logged-in";
	readonly LOGGED_OUT = "logged-out";

	constructor(private http: HttpClient, private api: ApiService) { }

	public login(username: string, password: string) {
		return this.http.post<any>(process.env.authApiUrl + '/login', {username: username, password: password}
			).map(response => {
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
/*console.log(err.Meta.status);
console.log(err.Response.errors);*/
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

		var token = this.getToken();
		if (!token) {
			return of(false);
		}

       	var opt =  {"base": "auth", "rawResponse": true};
        return this.api.get('profile', "", [], opt).pipe(
		/*return this.api.verify(true).pipe(*/
			map(response => {
				return true;
			}),
			catchError((error, caught) => {
				if (this.api.is_online()) {
					console.log("remove token?");
					this.removeToken();
				}
				return of(false); 
			})
		);
	}

	public hasRole(expectedRole: string): boolean {
		if (!expectedRole) {
			console.log("no role required")
			return true;
		}

        var user = this.getUser();
        if (!(expectedRole in user.roles)) {
            console.log("You are not authorized - missing role: " + expectedRole);
            return false;
        }
        console.log("ok " + expectedRole + " you are authorized")
        return true
	}
}

