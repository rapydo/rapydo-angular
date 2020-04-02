import { TestBed, getTestBed } from '@angular/core/testing';
import { AuthService } from '@rapydo/services/auth';

describe('AuthService', () => {
  let injector: TestBed;
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    injector = getTestBed();
    service = injector.get(AuthService);
  });

});