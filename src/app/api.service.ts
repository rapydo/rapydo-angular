
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiService {

	constructor(private http:HttpClient) { }


	public get(endpoint: string, id="", data=[], formData=false, extraConfig={}) {
		return this.call("GET", endpoint, id, data, formData, extraConfig)
	}
	public post(endpoint: string, data=[], formData=false, extraConfig={}) {
		return this.call("POST", endpoint, "", data, formData, extraConfig)
	}
	public put(endpoint: string, id="", data=[], formData=false, extraConfig={}) {
		return this.call("PUT", endpoint, id, data, formData, extraConfig)
	}
	public delete(endpoint: string, id="", formData=false, extraConfig={}) {
		return this.call("GET", endpoint, id, [], formData, extraConfig)
	}

	private call(method:string, endpoint: string, id="", data={}, formData=false, extraConfig={}) {

		var ep = process.env.apiUrl + "/" + endpoint;
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
		var returnRawResponse = false;

        if (skipPromiseResolve) return httpCall;

        return httpCall.subscribe(
        	response => {

                //$log.debug("API call successful");

                if (returnRawResponse) return response;

                if (response.Meta.status == 204) {
                	console.log("Debug me: status == 204");
                	console.log(response.Response);

                    if (response.Response.data == "") {
                        response.Response.data = "";
                    }
                }

                return response.Response;
          },
          error => {
				console.log("errorCallback");
                /*$log.warn("API failed to call")*/
                console.log("Warning: API failed to call")
            	console.log(error);
/*
                if (returnRawResponse) return $q.reject(error);

                if (!error.data || !error.data.hasOwnProperty('Response')) {
                    return $q.reject(null);
                }
                if (typeof error.data.Response === 'undefined') {
                    return $q.reject(null);
                }

                return $q.reject(error.data.Response);
*/
        });

	}





    /*apiCall = function (endpoint, method, data, id, returnRawResponse, skipPromiseResolve, formData, requestConfig)*/
    

}