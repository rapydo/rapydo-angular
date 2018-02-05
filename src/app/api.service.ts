
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

	constructor(private http:HttpClient) { }

	get() {
		return this.http.get("localhost:8080/api/status");
	}
}