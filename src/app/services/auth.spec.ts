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

  it('not authenticated', async () => {
    service.isAuthenticated().subscribe(
      result => {
        expect(result).toBeFalsy();
      }
    ); 
  });

  it('logged in', async () => {

    /*    
    const token = {
      'token': 'xyz',
    };
    */
    const token = 'xyz';

    service.login("x", "y").subscribe(
      result => {
        expect(result).toEqual('xyz');
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
    //loginRequest.error(new ErrorEvent('LOGIN FAILED'));

    httpMock.verify();
  });


  afterEach(() => {
    // make sure that there are no outstanding requests
    httpMock.verify();
  });

});