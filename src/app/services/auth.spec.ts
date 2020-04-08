import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppModule } from '@rapydo/app.module';
import { AuthService } from '@rapydo/services/auth';

import { environment } from '@rapydo/../environments/environment'

describe('AuthService', () => {
  let injector: TestBed;
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AuthService],
      imports: [
        AppModule, HttpClientTestingModule
      ]
    });

    injector = getTestBed();
    service = injector.get(AuthService);
    httpMock = injector.get(HttpTestingController);
  });

  it('not authenticated', async () => {
    service.isAuthenticated().subscribe(
      result => {
        expect(result).toBeFalsy();
      }
    ); 
  });

  it('failed login', async () => {

    service.login("x", "y").subscribe(
      result => {
        expect(result).toBeUndefined();
      },
      error => {
        if (environment.WRAP_RESPONSE == '1') {
          // skipped tests now
          expect(error.error).not.toBeUndefined();
        } else {
          expect(error.error).toEqual('Invalid username or password');
        }

        service.isAuthenticated().subscribe(
          result => {
            expect(result).toBeFalsy();
          }
        ); 

      }
    );

    const req = httpMock.expectOne(environment.authApiUrl + '/login');

    const mock401Response = {
      status: 401,
      statusText: 'UNAUTHORIZED'
    };
    expect(req.request.method).toEqual('POST');
    req.flush('Invalid username or password', mock401Response);

    httpMock.verify();
  });

  it('logged in', async () => {

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

    let user;
    if (environment.WRAP_RESPONSE == '1') {
      user = {
        "Meta": {

        },
        "Response": {
          "data": {
            "id": "xyz",
            "name": "xyz",
            "surname": "xyz",
            "email": "xyz",
          }
        }
      }
    } else {
      user = {
        "id": "xyz",
        "name": "xyz",
        "surname": "xyz",
        "email": "xyz",
      }
    }

    service.login("x", "y").subscribe(
      result => {
        if (environment.WRAP_RESPONSE == '1') {
          expect(result).not.toBeUndefined();
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

    const login_req = httpMock.expectOne(environment.authApiUrl + '/login');
    expect(login_req.request.method).toEqual('POST');
    login_req.flush(token);

    const user_req = httpMock.expectOne(environment.authApiUrl + '/profile');
    expect(user_req.request.method).toEqual('GET');
    user_req.flush(user);

    httpMock.verify();
  });

  it('logout - failuire', async () => {

    service.logout().subscribe(
      result => {
      },
      error => {
        service.isAuthenticated().subscribe(
          result => {
            expect(result).toBeFalsy();
          }
        );
      }
    );

    const logout_req = httpMock.expectOne(environment.authApiUrl + '/logout');

    const mock401Response = {
      status: 401,
      statusText: 'UNAUTHORIZED'
    };
    expect(logout_req.request.method).toEqual('GET');
    logout_req.flush('', mock401Response);

    const profile_req = httpMock.expectOne(environment.authApiUrl + '/profile');
    expect(profile_req.request.method).toEqual('GET');
    profile_req.flush('', mock401Response);

    httpMock.verify();
  });


  it('logout ok', async () => {

    service.logout().subscribe(
      result => {

        service.isAuthenticated().subscribe(
          result => {
            expect(result).toBeFalsy();
          }
        );

      },
      error => { }
    );

    const logout_req = httpMock.expectOne(environment.authApiUrl + '/logout');

    expect(logout_req.request.method).toEqual('GET');
    logout_req.flush('');

    const mock401Response = {
      status: 401,
      statusText: 'UNAUTHORIZED'
    };
    const profile_req = httpMock.expectOne(environment.authApiUrl + '/profile');
    expect(profile_req.request.method).toEqual('GET');
    profile_req.flush('', mock401Response);

    httpMock.verify();
  });

  afterEach(() => {
    // make sure that there are no outstanding requests
    httpMock.verify();
  });

});