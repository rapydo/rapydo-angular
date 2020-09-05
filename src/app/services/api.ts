import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { of, throwError, Observable } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

import { environment } from "@rapydo/../environments/environment";

const reader: FileReader = new FileReader();

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

  public get<T>(
    endpoint: string,
    id = "",
    data = {},
    options = {}
  ): Observable<T> {
    if (id !== "") {
      // Deprecated since 0.8
      console.warn("Deprecated use of id parameter in api.get");
      endpoint += "/" + id;
    }
    return this.call("GET", endpoint, data, options);
  }

  public post<T>(endpoint: string, data = {}, options = {}): Observable<T> {
    return this.call("POST", endpoint, data, options);
  }

  public put<T>(
    endpoint: string,
    id = "",
    data = {},
    options = {}
  ): Observable<T> {
    if (id !== "") {
      // Deprecated since 0.8
      console.warn("Deprecated use of id parameter in api.get");
      endpoint += "/" + id;
    }
    return this.call("PUT", endpoint, data, options);
  }

  public patch<T>(
    endpoint: string,
    id = "",
    data = {},
    options = {}
  ): Observable<T> {
    if (id !== "") {
      // Deprecated since 0.8
      console.warn("Deprecated use of id parameter in api.get");
      endpoint += "/" + id;
    }
    return this.call("PATCH", endpoint, data, options);
  }

  public delete<T>(endpoint: string, id = "", options = {}): Observable<T> {
    if (id !== "") {
      // Deprecated since 0.8
      console.warn("Deprecated use of id parameter in api.get");
      endpoint += "/" + id;
    }
    return this.call("DELETE", endpoint, {}, options);
  }

  protected call<T>(
    method: string,
    endpoint: string,
    data = {},
    options = {}
  ): Observable<T> {
    let formData = this.opt(options, "formData");
    let conf = this.opt(options, "conf");
    let base = this.opt(options, "base");
    let rawError = this.opt(options, "rawError", false);

    let ep = "";
    if (base === "auth") {
      ep = environment.authApiUrl + "/" + endpoint;
    } else {
      ep = environment.apiUrl + "/" + endpoint;
    }

    let contentType;
    if (formData) {
      contentType = "application/x-www-form-urlencoded";
    } else {
      contentType = "application/json";
    }

    let opt = {
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
        opt[k] = conf[k];
      }
    }

    let httpCall;
    if (method === "GET") {
      opt["params"] = data;
      httpCall = this.http.get(ep, opt);
    } else if (method === "POST") {
      httpCall = this.http.post(ep, data, opt);
    } else if (method === "PUT") {
      httpCall = this.http.put(ep, data, opt);
    } else if (method === "PATCH") {
      httpCall = this.http.patch(ep, data, opt);
    } else if (method === "DELETE") {
      httpCall = this.http.delete(ep, opt);
    } else {
      console.error("Unknown API method: " + method);
      return null;
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
        if (error.status === 502) {
          return throwError({
            "Resource unavailable":
              "The page you are looking for is currently unreachable",
          });
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

  // Utility to convert Blob errors into text
  // example of use:
  // return this.http.post<Blob>("endpoint", null, {
  //     params: params,
  //     responseType: "blob" as "json",
  //   }).pipe(catchError(this.parseErrorBlob));
  public parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    const obs = Observable.create((observer: any) => {
      reader.onloadend = (e) => {
        observer.error(JSON.parse(reader.result as string));
        observer.complete();
      };
    });
    reader.readAsText(err.error);
    return obs;
  }
}
