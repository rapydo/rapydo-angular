
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiService {

	public static is_online: boolean; 

	constructor(private http:HttpClient) { }

	public is_online(): boolean {
		return ApiService.is_online;
	}
	public set_online() {

		ApiService.is_online = true;
		return ApiService.is_online;

	}
	public set_offline() {

		ApiService.is_online = false;
		return ApiService.is_online;
		
	}
	private opt(dict, value, defaultValue) {
		if (value in dict) {
			return dict[value];
		} else {
			return defaultValue;
		}
	}
	public get(endpoint: string, id="", data={}, options={}) {
		var formData = this.opt(options, "formData", undefined);
		var conf = this.opt(options, "conf", undefined);
		var base = this.opt(options, "base", undefined);
		var rawResponse = this.opt(options, "rawResponse", undefined);
		return this.call("GET", endpoint, id, data, formData, conf, base, rawResponse);
	}
	public post(endpoint: string, data={}, options={}) {
		var formData = this.opt(options, "formData", undefined);
		var conf = this.opt(options, "conf", undefined);
		var base = this.opt(options, "base", undefined);
		var rawResponse = this.opt(options, "rawResponse", undefined);

		return this.call("POST", endpoint, "", data, formData, conf, base, rawResponse)
	}
	public put(endpoint: string, id="", data={}, options={}) {
		var formData = this.opt(options, "formData", undefined);
		var conf = this.opt(options, "conf", undefined);
		var base = this.opt(options, "base", undefined);
		var rawResponse = this.opt(options, "rawResponse", undefined);
		return this.call("PUT", endpoint, id, data, formData, conf, base, rawResponse)
	}
	public delete(endpoint: string, id="", options={}) {
		var formData = this.opt(options, "formData", undefined);
		var conf = this.opt(options, "conf", undefined);
		var base = this.opt(options, "base", undefined);
		var rawResponse = this.opt(options, "rawResponse", undefined);
		return this.call("DELETE", endpoint, id, {}, formData, conf, base, rawResponse)
	}

	private call(
		method:string, endpoint: string, id="", data={},
		formData=false, conf={}, base='api', rawResponse=false) {

		var ep = "";
		if (base == "auth") {
			ep = process.env.authApiUrl + "/" + endpoint;
		} else {
			ep = process.env.apiUrl + "/" + endpoint;
		}
		if (id != "") {
			ep += "/" + id;
		}

    	var contentType = 'application/json';
        if (formData) {
        	// How to convert in angular2/5 ?
            /*data = $httpParamSerializerJQLike(data)*/
            contentType = 'application/x-www-form-urlencoded';
        }

		var options = {
			headers: new HttpHeaders({
				'Content-Type': contentType,
				'Accept': 'application/json'
			})
		};
		options["timeout"] = 30000;
        for (var k in conf) {
            options[k] = conf[k]
        }

        var httpCall = undefined;
		if (method == "GET") {
			options["params"] = data;
			httpCall = this.http.get(ep, options);
		} else if (method == "POST") {
			httpCall = this.http.post(ep, data, options);
		} else if (method == "PUT") {
			httpCall = this.http.put(ep, data, options);
		} else if (method == "DELETE") {
			httpCall = this.http.delete(ep, options);
		} else {
			console.log("API ERROR, unknown method: " + method);
			return false;
		}

        return httpCall.pipe(
        	map(response => {

        		this.set_online();
                //$log.debug("API call successful");
                if (rawResponse) return response;

                if (response === null) {
/*                	response = {}
                	response.Meta = {}
                	response.Meta.status = 204
                	response.Response = {}
                	response.Response.data = ""*/
                }

                return response["Response"];
            }),
            catchError(error => {

                /*console.log("Warning: API failed to call")*/
            	if (error.status <= 0) {
            		this.set_offline();
            	} else {
            		this.set_online();
            	}

            	if (rawResponse) return _throw(error);
            	return _throw(error.error["Response"])
	        })
        );
	}

}