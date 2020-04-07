import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppModule } from '@rapydo/app.module';
import { AuthService } from '@rapydo/services/auth';

import { ApiService } from '@rapydo/services/api';
import { ApiServiceStub } from '@rapydo/services/api.stub';

import { environment } from '@rapydo/../environments/environment'

describe('AuthService', () => {
  let injector: TestBed;
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
      	AuthService,
        {provide: ApiService, useValue: ApiServiceStub},
      ],
      imports: [
        AppModule, HttpClientTestingModule
      ]
    });

    injector = getTestBed();
    service = injector.get(AuthService);
    httpMock = injector.get(HttpTestingController);
  });

  it('not authenticated', () => {
    service.isAuthenticated().subscribe(
      result => {
        expect(result).toBeFalsy();
      }
    ); 
  });

  it('failed login', () => {

    service.login("x", "y").subscribe(
      result => {
        expect(result).toBeUndefined();
      },
      error => {
        if (environment.WRAP_RESPONSE == '1') {
          // skipped tests now
        } else {
          expect(error).toEqual('LOGIN FAILED');
        }
      }
    );

    const req = httpMock.expectOne(environment.authApiUrl + '/login');

    expect(req.request.method).toEqual('POST');
    ref.error(new ErrorEvent('LOGIN FAILED'));

    httpMock.verify();
  });

  it('logged in', () => {

    let token;
    if (environment.WRAP_RESPONSE == '1') {
      token = {
        "Meta": {

        },
        "Response": {
          "data": {
            "token": "xyz"
          }
        }
      }
    } else {
      token = "xyz";
    }

    service.login("x", "y").subscribe(
      result => {
        if (environment.WRAP_RESPONSE == '1') {
          // skipped tests now
        } else {
          expect(result).toEqual('xyz');
        }
        service.isAuthenticated().subscribe(
          result => {
            expect(result).toBeTruthy();
          }
        );
      }
    );

    const req = httpMock.expectOne(environment.authApiUrl + '/login');

    expect(req.request.method).toEqual('POST');
    req.flush(token);             

    httpMock.verify();
  });


  afterEach(() => {
    // make sure that there are no outstanding requests
    httpMock.verify();
  });

});