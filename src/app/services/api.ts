import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { of, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "@rapydo/../environments/environment";

@Injectable()
export class ApiService {
  public static is_online: boolean = true;

  constructor(private http: HttpClient) {}

  public is_online(): boolean {
    return ApiService.is_online;
  }
  public set_online(): boolean {
    ApiService.is_online = true;
    return ApiService.is_online;
  }
  public set_offline(): boolean {
    ApiService.is_online = false;
    return ApiService.is_online;
  }

  private opt(dict, value, defaultValue = null) {
    if (value in dict) {
      return dict[value];
    } else {
      return defaultValue;
    }
  }

  public get(endpoint: string, id = "", data = {}, options = {}) {
    let formData = this.opt(options, "formData");
    let conf = this.opt(options, "conf");
    let base = this.opt(options, "base");
    let raw = this.opt(options, "rawError", false);
    return this.call("GET", endpoint, id, data, formData, conf, base, raw);
  }

  public post(endpoint: string, data = {}, options = {}) {
    let formData = this.opt(options, "formData");
    let conf = this.opt(options, "conf");
    let base = this.opt(options, "base");
    let raw = this.opt(options, "rawError", false);
    return this.call("POST", endpoint, "", data, formData, conf, base, raw);
  }

  public put(endpoint: string, id = "", data = {}, options = {}) {
    let formData = this.opt(options, "formData");
    let conf = this.opt(options, "conf");
    let base = this.opt(options, "base");
    let rawError = this.opt(options, "rawError", false);
    return this.call("PUT", endpoint, id, data, formData, conf, base, rawError);
  }

  public patch(endpoint: string, id = "", data = {}, options = {}) {
    let formData = this.opt(options, "formData");
    let conf = this.opt(options, "conf");
    let base = this.opt(options, "base");
    let rawError = this.opt(options, "rawError", false);
    return this.call(
      "PATCH",
      endpoint,
      id,
      data,
      formData,
      conf,
      base,
      rawError
    );
  }

  public delete(endpoint: string, id = "", options = {}) {
    let formData = this.opt(options, "formData");
    let conf = this.opt(options, "conf");
    let base = this.opt(options, "base");
    let rawError = this.opt(options, "rawError", false);
    return this.call(
      "DELETE",
      endpoint,
      id,
      {},
      formData,
      conf,
      base,
      rawError
    );
  }

  protected call(
    method: string,
    endpoint: string,
    id = "",
    data = {},
    formData = false,
    conf = {},
    base = "api",
    rawError = false
  ) {
    let ep = "";
    if (base === "auth") {
      ep = environment.authApiUrl + "/" + endpoint;
    } else {
      ep = environment.apiUrl + "/" + endpoint;
    }
    if (id !== "") {
      ep += "/" + id;
    }

    let contentType;
    if (formData) {
      contentType = "application/x-www-form-urlencoded";
    } else {
      contentType = "application/json";
    }

    let options = {
      timeout: 30000,
      headers: new HttpHeaders({
        "Content-Type": contentType,
        Accept: "application/json",
      }),
    };
    for (let k in conf) {
      // The body of a for-in should be wrapped in an if statement
      // to filter unwanted properties from the prototype.
      if ({}.hasOwnProperty.call(conf, k)) {
        options[k] = conf[k];
      }
    }

    let httpCall;
    if (method === "GET") {
      options["params"] = data;
      httpCall = this.http.get(ep, options);
    } else if (method === "POST") {
      httpCall = this.http.post(ep, data, options);
    } else if (method === "PUT") {
      httpCall = this.http.put(ep, data, options);
    } else if (method === "PATCH") {
      httpCall = this.http.patch(ep, data, options);
    } else if (method === "DELETE") {
      httpCall = this.http.delete(ep, options);
    } else {
      console.error("Unknown API method: " + method);
      return false;
    }

    return httpCall.pipe(
      map((response) => {
        this.set_online();

        return response;
      }),
      catchError((error) => {
        if (error.status === null && error.error === null) {
          // 204 empty responses
          return of("");
        }
        // Note that Chrome also returns status 0 in case of CORS issues.
        // A wrong endpoint will raise a 404 error from OPTIONS pre-flight request,
        // this will bring to a CORS error on the request === a error status 0
        // => missing endpoint === 404 on pre-flight === 0 on request === OFFLINE :\
        // Same error status 0 is obtained when APIs are not reachable
        // => server offline === endpoint is missing :\
        if (error.status <= 0) {
          this.set_offline();
        } else {
          this.set_online();
        }

        if (rawError) {
          return throwError(error);
        }
        // This is a HttpErrorResponse
        if (error.error) {
          if (error.error instanceof ProgressEvent) {
            if (error.message.startsWith("Http failure response for ")) {
              // strip off the URL
              return throwError("Http request failed: unknown error");
            }
            return throwError(error.message);
          }

          return throwError(error.error);
        }
        // This is a 'normal' error
        return throwError(error);
      })
    );
  }
}
