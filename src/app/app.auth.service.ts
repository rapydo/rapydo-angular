import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

	@Output() userChanged: EventEmitter<string> = new EventEmitter<string>();

	readonly LOGGED_IN = "logged-in";
	readonly LOGGED_OUT = "logged-out";

	constructor(private http: HttpClient) { }

	public login(username: string, password: string) {
		const globalConfig = require('globalConfig');
		return this.http.post<any>(globalConfig.authApiUrl + '/login', {username: username, password: password}
			).map(response => {
				if (response && response.Response && response.Response.data && response.Response.data.token) {
					this.setToken(JSON.stringify(response.Response.data.token))
				}

				return response;
			});
	}

	public loadUser() {

		const globalConfig = require('globalConfig');
		return this.http.get<any>(globalConfig.authApiUrl + '/profile').map(
			response => {
				if (response && response.Response && response.Response.data) {
					this.setUser(JSON.stringify(response.Response.data));
				}

				return response;
		});
	}

	public logout() {
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
	public isAuthenticated(): boolean {

		var token = this.getToken();
		if (token) {
			return true;
		} else {
			return false;
		}
	}

	public hasRole(expectedRole: string): boolean {
		if (expectedRole) {
			console.log("Expected role: " + expectedRole + " -> not implemented");
			return false
		} else {
			// No role expected -> that's ok, return true
			return true;
		}
	}

}