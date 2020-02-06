import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@rapydo/../environments/environment';

export interface ApiResponse {
  errors: string[];
}

@Injectable()
export class ApiService {

  public static is_online: boolean = true; 

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
    let formData = this.opt(options, "formData", undefined);
    let conf = this.opt(options, "conf", undefined);
    let base = this.opt(options, "base", undefined);
    let rawResponse = this.opt(options, "rawResponse", undefined);
    return this.call("GET", endpoint, id, data, formData, conf, base, rawResponse);
  }
  public post(endpoint: string, data={}, options={}) {
    let formData = this.opt(options, "formData", undefined);
    let conf = this.opt(options, "conf", undefined);
    let base = this.opt(options, "base", undefined);
    let rawResponse = this.opt(options, "rawResponse", undefined);

    return this.call("POST", endpoint, "", data, formData, conf, base, rawResponse)
  }
  public put(endpoint: string, id="", data={}, options={}) {
    let formData = this.opt(options, "formData", undefined);
    let conf = this.opt(options, "conf", undefined);
    let base = this.opt(options, "base", undefined);
    let rawResponse = this.opt(options, "rawResponse", undefined);
    return this.call("PUT", endpoint, id, data, formData, conf, base, rawResponse)
  }
  public patch(endpoint: string, id="", data={}, options={}) {
    let formData = this.opt(options, "formData", undefined);
    let conf = this.opt(options, "conf", undefined);
    let base = this.opt(options, "base", undefined);
    let rawResponse = this.opt(options, "rawResponse", undefined);
    return this.call("PATCH", endpoint, id, data, formData, conf, base, rawResponse)
  }
  public delete(endpoint: string, id="", options={}) {
    let formData = this.opt(options, "formData", undefined);
    let conf = this.opt(options, "conf", undefined);
    let base = this.opt(options, "base", undefined);
    let rawResponse = this.opt(options, "rawResponse", undefined);
    return this.call("DELETE", endpoint, id, {}, formData, conf, base, rawResponse)
  }

  private call(
    method:string, endpoint: string, id="", data={},
    formData=false, conf={}, base='api', rawResponse=false) {

    let ep = "";
    if (base == "auth") {
      ep = environment.authApiUrl + "/" + endpoint;
    } else {
      ep = environment.apiUrl + "/" + endpoint;
    }
    if (id != "") {
      ep += "/" + id;
    }

    let contentType = 'application/json';
    if (formData) {
      contentType = 'application/x-www-form-urlencoded';
    }

    let options = {
      headers: new HttpHeaders({
        'Content-Type': contentType,
        'Accept': 'application/json'
      })
    };
    options["timeout"] = 30000;
    for (let k in conf) {
        options[k] = conf[k]
    }

    let httpCall = undefined;
    if (method == "GET") {
      options["params"] = data;
      httpCall = this.http.get(ep, options);
    } else if (method == "POST") {
      httpCall = this.http.post(ep, data, options);
    } else if (method == "PUT") {
      httpCall = this.http.put(ep, data, options);
    } else if (method == "PATCH") {
      httpCall = this.http.patch(ep, data, options);
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

        return response["Response"];
      }),
      catchError(error => {
        if (error.status == null && error.error == null) {
          // 204 empty responses
          /* 
            response = {}
            response.Meta = {}
            response.Meta.status = 204
            response.Response = {}
            response.Response.data = ""
          */
          return of("");
        }
        // Note that Chrome also returns status 0 in case of CORS issues.
        // A wrong endpoint will raise a 404 error from OPTIONS pre-flight request,
        // this will bring to a CORS error on the request == a error status 0
        // => missing endpoint == 404 on pre-flight == 0 on request == OFFLINE :\
        // Same error status 0 is obtained when APIs are not reachable
        // => server offline == endpoint is missing :\
        if (error.status <= 0) {
          this.set_offline();
        } else {
          this.set_online();
        }

        if (rawResponse) return throwError(error);
        return throwError(error.error)
      })
    );
  }

  public parseElement(element) {

    let newelement = null;
    if (element.hasOwnProperty('attributes')) {
      newelement = element.attributes;
    } else {
      newelement = element;
    }

    if (element.hasOwnProperty('id')) {
      newelement.id = element.id;
    }

    if (element.hasOwnProperty('relationships')) {
      for (let key in element.relationships) {
        let subelement = element.relationships[key]
        let k = '_'+key;
        if (subelement.length == 1) {
          newelement[k] = [this.parseElement(subelement[0])];
        } else {
          newelement[k] = [];
          for (let i=0; i<subelement.length; i++) {
            newelement[k].push(this.parseElement(subelement[i]));
          }
        }
      }
    }

    return newelement;
  }

  public parseResponse(response) {

    if (!response || !response.length) {
      return response;
    }

    let newresponse = []
    for (let i=0; i<response.length; i++) {
      let element = this.parseElement(response[i]);

      newresponse.push(element);
    }
    return newresponse;
  }

}