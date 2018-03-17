
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiService {

	constructor(private http:HttpClient) { }

	private opt(dict, value, defaultValue) {
		if (value in dict) {
			return dict[value];
		} else {
			return defaultValue;
		}
	}
	public get(endpoint: string, id="", data=[], options={}) {
		var formData = this.opt(options, "formData", undefined);
		var extraConfig = this.opt(options, "extraConfig", undefined);
		var base = this.opt(options, "base", undefined);
		var rawResponse = this.opt(options, "rawResponse", undefined);
		return this.call("GET", endpoint, id, data, formData, extraConfig, base, rawResponse);
	}
	public post(endpoint: string, data=[], options={}) {
		var formData = this.opt(options, "formData", undefined);
		var extraConfig = this.opt(options, "extraConfig", undefined);
		var base = this.opt(options, "base", undefined);
		var rawResponse = this.opt(options, "rawResponse", undefined);
		return this.call("POST", endpoint, "", data, formData, extraConfig, base, rawResponse)
	}
	public put(endpoint: string, id="", data=[], options={}) {
		var formData = this.opt(options, "formData", undefined);
		var extraConfig = this.opt(options, "extraConfig", undefined);
		var base = this.opt(options, "base", undefined);
		var rawResponse = this.opt(options, "rawResponse", undefined);
		return this.call("PUT", endpoint, id, data, formData, extraConfig, base, rawResponse)
	}
	public delete(endpoint: string, id="", options={}) {
		var formData = this.opt(options, "formData", undefined);
		var extraConfig = this.opt(options, "extraConfig", undefined);
		var base = this.opt(options, "base", undefined);
		var rawResponse = this.opt(options, "rawResponse", undefined);
		return this.call("DELETE", endpoint, id, [], formData, extraConfig, base, rawResponse)
	}

	private call(
		method:string, endpoint: string, id="", data={},
		formData=false, extraConfig={}, base='api', rawResponse=false) {

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
        for (var k in extraConfig) {
            options[k] = extraConfig[k]
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

		var skipPromiseResolve = false;

        if (skipPromiseResolve) return httpCall;

        try {
	        return httpCall.map(
	        	response => {

	                //$log.debug("API call successful");
	                if (rawResponse) return response;

	                if (response === null) {
	                	response = {}
	                	response.Meta = {}
	                	response.Meta.status = 204
	                	response.Response = {}
	                	response.Response.data = ""
	                }

	                return response.Response;
	          },
	          error => {
					console.log("errorCallback");
	                /*$log.warn("API failed to call")*/
	                console.log("Warning: API failed to call")
	            	console.log(error);
	/*
	                if (rawResponse) return $q.reject(error);

	                if (!error.data || !error.data.hasOwnProperty('Response')) {
	                    return $q.reject(null);
	                }
	                if (typeof error.data.Response === 'undefined') {
	                    return $q.reject(null);
	                }

	                return $q.reject(error.data.Response);
	*/
					return error.data.Response;
	        });
	    } catch(err) {
	    	console.log("argh!");
	    	console.log(err);
	    }

	}

    private verify = function(logged)
    {
        var endpoint = '';
        var base = '';
        if (logged) {
            endpoint = 'profile';
            base = "auth"
        } else {
        	endpoint = 'status';
        	base = "api"
        }
        /*return self.apiCall(endpoint, 'GET', undefined, undefined, true)*/
        return this.get(endpoint, "", [], {"base": base, "rawResponse": true}).map(

        	function successCallback(response) {
                if (response.Meta.status < 0) {
                	console.log("API offline?")
                    // API offline
                    return null;
                }
                return response.Response.data;
                //return true;
            }, function errorCallback(response) {
                return false
            });
    }





    /*apiCall = function (endpoint, method, data, id, rawResponse, skipPromiseResolve, formData, requestConfig)*/
    

}