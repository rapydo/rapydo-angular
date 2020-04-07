import { TestBed, getTestBed } from '@angular/core/testing';
import { AuthService } from '@rapydo/services/auth';

import { ApiServiceStub } from '@rapydo/services/api.stub';

describe('AuthService', () => {
  let injector: TestBed;
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
      	AuthService,
        {provide: ApiService, useValue: ApiServiceStub},
      ],
    });

    injector = getTestBed();
    service = injector.get(AuthService);
  });

  it('trivial test', () => {
    expect(service.isAuthenticated()).toBeTruthy();
  });

});