import { TestBed, getTestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { AppModule } from "@rapydo/app.module";
import { ApiService } from "@rapydo/services/api";

import { environment } from "@rapydo/../environments/environment";

describe("ApiService", () => {
  let injector: TestBed;
  let service: ApiService;
  let httpMock: HttpTestingController;

  const mock401Response = {
    status: 401,
    statusText: "UNAUTHORIZED",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService],
      imports: [AppModule, HttpClientTestingModule],
    });

    injector = getTestBed();
    service = injector.inject(ApiService);
    httpMock = injector.inject(HttpTestingController);
  });

  it("GET - success", () => {
    service.get("xyz").subscribe((result) => {
      expect(result).not.toBeUndefined();
    });

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz");
    expect(req.request.method).toEqual("GET");
    req.flush("");

    httpMock.verify();
  });

  it("GET - fail", () => {
    service.get("xyz").subscribe(
      (result) => {},
      (error) => {
        expect(error).not.toBeUndefined();
      }
    );

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz");
    expect(req.request.method).toEqual("GET");
    req.flush("FAILED", mock401Response);

    httpMock.verify();
  });

  it("POST - success", () => {
    service.post("xyz", { key: "value" }).subscribe((result) => {
      expect(result).not.toBeUndefined();
    });

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz");
    expect(req.request.method).toEqual("POST");
    req.flush("");

    httpMock.verify();
  });

  it("POST - fail", () => {
    service.post("xyz", { key: "value" }).subscribe(
      (result) => {},
      (error) => {
        expect(error).not.toBeUndefined();
      }
    );

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz");
    expect(req.request.method).toEqual("POST");
    req.flush("FAILED", mock401Response);

    httpMock.verify();
  });

  it("DELETE - success", () => {
    service.delete("xyz").subscribe((result) => {
      expect(result).not.toBeUndefined();
    });

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz");
    expect(req.request.method).toEqual("DELETE");
    req.flush("");

    httpMock.verify();
  });

  it("DELETE - fail", () => {
    service.delete("xyz").subscribe(
      (result) => {},
      (error) => {
        expect(error).not.toBeUndefined();
      }
    );

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz");
    expect(req.request.method).toEqual("DELETE");
    req.flush("FAILED", mock401Response);

    httpMock.verify();
  });

  it("PUT - success", () => {
    service.put("xyz", "id", { key: "value" }).subscribe((result) => {
      expect(result).not.toBeUndefined();
    });

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz/id");
    expect(req.request.method).toEqual("PUT");
    req.flush("");

    httpMock.verify();
  });

  it("PUT - fail", () => {
    service.put("xyz", "id", { key: "value" }).subscribe(
      (result) => {},
      (error) => {
        expect(error).not.toBeUndefined();
      }
    );

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz/id");
    expect(req.request.method).toEqual("PUT");
    req.flush("FAILED", mock401Response);

    httpMock.verify();
  });

  it("PATCH - success", () => {
    service.patch("xyz/id", "", { key: "value" }).subscribe((result) => {
      expect(result).not.toBeUndefined();
    });

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz/id");
    expect(req.request.method).toEqual("PATCH");
    req.flush("");

    httpMock.verify();
  });

  it("PATCH - fail", () => {
    service.patch("xyz/id", "", { key: "value" }).subscribe(
      (result) => {},
      (error) => {
        expect(error).not.toBeUndefined();
      }
    );

    const req = httpMock.expectOne(environment.backendURI + "/api/xyz/id");
    expect(req.request.method).toEqual("PATCH");
    req.flush("FAILED", mock401Response);

    httpMock.verify();
  });

  afterEach(() => {
    // make sure that there are no outstanding requests
    httpMock.verify();
  });
});
