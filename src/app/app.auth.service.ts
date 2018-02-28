import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

	@Output() userChanged: EventEmitter<any> = new EventEmitter<any>();

	constructor(private http: HttpClient) { }

	public login(username: string, password: string) {
		return this.http.post<any>('http://localhost:8080/auth/login', {username: username, password: password}
			).map(response => {
				if (response && response.Response && response.Response.data && response.Response.data.token) {
					this.setToken(JSON.stringify(response.Response.data.token))
				}

				return response;
			});
	}

	public loadUser() {

		return this.http.get<any>('http://localhost:8080/auth/profile').map(
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
		console.log("Bye bye");
		this.userChanged.emit("logged-out");
	}

	public setUser(user: any) {
		localStorage.setItem('currentUser', user);
		console.log("Logged in");
		this.userChanged.emit("logged-in");
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
			console.log(expectedRole);
			return false
		} else {
			// No role expected -> that's ok, return true
			return true;
		}
	}

}