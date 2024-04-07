import { TestBed, getTestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { AppModule } from "@rapydo/app.module";
import { AuthService } from "@rapydo/services/auth";

import { environment } from "@rapydo/../environments/environment";

describe("AuthService", () => {
  let injector: TestBed;
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mock401Response = {
    status: 401,
    statusText: "UNAUTHORIZED",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [AppModule, HttpClientTestingModule],
      teardown: { destroyAfterEach: false },
    });

    injector = getTestBed();
    service = injector.inject(AuthService);
    httpMock = injector.inject(HttpTestingController);
  });

  it("not authenticated", async () => {
    service.isAuthenticated().subscribe((result) => {
      expect(result).toBeFalsy();
    });
  });

  it("failed login", async () => {
    service.login("x", "y").subscribe(
      (result) => {
        expect(result).toBeUndefined();
      },
      (error) => {
        expect(error.error).toEqual("Invalid access credentials");

        service.isAuthenticated().subscribe((result) => {
          expect(result).toBeFalsy();
        });
      },
    );

    const req = httpMock.expectOne(environment.backendURI + "/auth/login");

    expect(req.request.method).toEqual("POST");
    req.flush("Invalid access credentials", mock401Response);
    const localizationReq = httpMock.match("app/rapydo/assets/i18n/en.json");
    if (localizationReq.length > 0) {
      localizationReq.forEach((req) => req.flush({}));
    }
    httpMock.verify();
  });

  it("logged in", async () => {
    const token = "xyz";
    const user = {
      id: "xyz",
      name: "xyz",
      surname: "xyz",
      email: "xyz",
    };

    service.login("x", "y").subscribe((result) => {
      expect(result).toEqual("xyz");

      service.isAuthenticated().subscribe((result) => {
        expect(result).toBeTruthy();
      });
    });

    const login_req = httpMock.expectOne(
      environment.backendURI + "/auth/login",
    );
    expect(login_req.request.method).toEqual("POST");
    login_req.flush(token);

    const user_req = httpMock.expectOne(
      environment.backendURI + "/auth/status",
    );
    expect(user_req.request.method).toEqual("GET");
    user_req.flush(user);
    const localizationReq = httpMock.match("app/rapydo/assets/i18n/en.json");
    if (localizationReq.length > 0) {
      localizationReq.forEach((req) => req.flush({}));
    }
    httpMock.verify();
  });

  it("logout - failure", async () => {
    service.logout().subscribe(
      (result) => {},
      (error) => {
        service.isAuthenticated().subscribe((result) => {
          expect(result).toBeFalsy();
        });
      },
    );

    const logout_req = httpMock.expectOne(
      environment.backendURI + "/auth/logout",
    );

    expect(logout_req.request.method).toEqual("GET");
    logout_req.flush("", mock401Response);

    const profile_req = httpMock.expectOne(
      environment.backendURI + "/auth/status",
    );
    expect(profile_req.request.method).toEqual("GET");
    profile_req.flush("", mock401Response);
    const localizationReq = httpMock.match("app/rapydo/assets/i18n/en.json");
    if (localizationReq.length > 0) {
      localizationReq.forEach((req) => req.flush({}));
    }
    httpMock.verify();
  });

  it("logout ok", async () => {
    service.logout().subscribe(
      (result) => {
        service.isAuthenticated().subscribe((result) => {
          expect(result).toBeFalsy();
        });
      },
      (error) => {},
    );

    const logout_req = httpMock.expectOne(
      environment.backendURI + "/auth/logout",
    );
    expect(logout_req.request.method).toEqual("GET");
    logout_req.flush("");
    const localizationReq = httpMock.match("app/rapydo/assets/i18n/en.json");
    if (localizationReq.length > 0) {
      localizationReq.forEach((req) => req.flush({}));
    }
    httpMock.verify();
  });

  afterEach(() => {
    if (localizationReq.length > 0) {
      localizationReq.forEach((req) => req.flush({}));
    }
    // make sure that there are no outstanding requests
    httpMock.verify();
  });
});
