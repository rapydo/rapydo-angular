import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { catchError, map } from "rxjs/operators";
import { of, throwError, Observable } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

import { NotificationService } from "@rapydo/services/notification";
import { SSRService } from "@rapydo/services/ssr";
import { environment } from "@rapydo/../environments/environment";

import { validate } from "@rapydo/validate";

@Injectable()
export class ApiService {
  public static is_online: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notify: NotificationService,
    private ssr: SSRService
  ) {}

  public is_online(): boolean {
    return ApiService.is_online;
  }
  public set_online(): boolean {
    ApiService.is_online = true;
    return ApiService.is_online;
  }
  /* istanbul ignore next */
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
    data: Record<string, unknown> = {},
    options: Record<string, unknown> = {}
  ): Observable<T> {
    return this.call<T>("GET", endpoint, data, options);
  }

  public post<T>(
    endpoint: string,
    data: Record<string, unknown> = {},
    options: Record<string, unknown> = {}
  ): Observable<T> {
    return this.call<T>("POST", endpoint, data, options);
  }

  public put<T>(
    endpoint: string,
    data: Record<string, unknown> = {},
    options: Record<string, unknown> = {}
  ): Observable<T> {
    return this.call<T>("PUT", endpoint, data, options);
  }

  public patch<T>(
    endpoint: string,
    data: Record<string, unknown> = {},
    options: Record<string, unknown> = {}
  ): Observable<T> {
    return this.call<T>("PATCH", endpoint, data, options);
  }

  public delete<T>(
    endpoint: string,
    options: Record<string, unknown> = {}
  ): Observable<T> {
    return this.call<T>("DELETE", endpoint, {}, options);
  }

  protected call<T>(
    method: string,
    endpoint: string,
    data: Record<string, unknown> = {},
    options: Record<string, unknown> = {}
  ): Observable<T> {
    const conf = this.opt(options, "conf");
    const rawError = this.opt(options, "rawError", false);
    const validationSchema = this.opt(options, "validationSchema");
    const redirectOnInvalidTokens = this.opt(options, "redirect", true);

    // If starting with / it is considered to be an internal URL
    // otherwise it is considered to be an external url starting with protocol://
    if (endpoint.startsWith("/")) {
      endpoint = environment.backendURI + endpoint;
    }

    // let contentType;
    // let formData = this.opt(options, "formData");
    // if (formData) {
    //   contentType = "application/x-www-form-urlencoded";
    // } else {
    //   contentType = "application/json";
    // }

    let opt = {
      timeout: 30000,
      headers: new HttpHeaders({
        "Content-Type": "application/json",
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

    let httpCall = null;
    if (method === "GET") {
      opt["params"] = data;
      httpCall = this.http.get<T>(endpoint, opt);
    } else if (method === "POST") {
      httpCall = this.http.post<T>(endpoint, data, opt);
    } else if (method === "PUT") {
      httpCall = this.http.put<T>(endpoint, data, opt);
    } else if (method === "PATCH") {
      httpCall = this.http.patch<T>(endpoint, data, opt);
    } else if (method === "DELETE") {
      httpCall = this.http.delete<T>(endpoint, opt);
    }

    /* istanbul ignore next */
    if (httpCall === null) {
      console.error("Unknown API method: " + method);
      return null;
    }

    return httpCall.pipe(
      map((response: T) => {
        this.set_online();

        if (validationSchema) {
          try {
            const errors = validate(validationSchema, response);

            if (errors) {
              for (let error of errors) {
                this.notify.showError(
                  error,
                  `Invalid ${validationSchema} response`
                );
              }
              throw new Error("Response validation error");
            }
          } catch (e) {
            if (e instanceof TypeError) {
              console.warn(e);
            }
          }
        }
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

        if (redirectOnInvalidTokens && error.status === 401) {
          // Should be done by executing auth.removeToken... But AuthService can't
          // be included here due to circular dependencies
          // These removeItem are needed to prevent the automatic execution of logout
          // (from login component) that will fail because the token is invalid.
          // The failure will be intercepeted again here and an additional returnUrl
          // will be appended and this will mess the url
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");

          this.router.navigate(["app/login"], {
            queryParams: { returnUrl: this.router.url },
          });
          if (
            !rawError &&
            this.parse_error(error) === "Invalid token received"
          ) {
            return throwError({ "Invalid token": "This session is expired" });
          }
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
        return throwError(this.parse_error(error));
      })
    );
  }

  private parse_error(error) {
    // This is a HttpErrorResponse
    if (error.error) {
      // if SSR: ReferenceError: ProgressEvent is not defined
      if (this.ssr.isBrowser && error.error instanceof ProgressEvent) {
        if (error.message.startsWith("Http failure response for ")) {
          // strip off the URL
          return "Http request failed: unknown error";
        }
        return error.message;
      }

      return error.error;
    }
    // This is a 'normal' error
    return error;
  }

  // Utility to convert Blob errors into text
  // example of use:
  // return this.http.post<Blob>("endpoint", null, {
  //     params: params,
  //     responseType: "blob" as "json",
  //   }).pipe(catchError(this.parseErrorBlob));
  /* istanbul ignore next */
  public parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    if (err.error instanceof Blob) {
      // This is only executed from the browser and skipped during SSR
      if (this.ssr.isBrowser) {
        const reader: FileReader = new FileReader();
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

    if (err.error instanceof ProgressEvent) {
      return throwError(err.message);
    }

    return throwError(err.error);
  }
}
