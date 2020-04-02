import { TestBed, getTestBed } from '@angular/core/testing';
import { ApiService } from '@rapydo/services/websockets';

describe('ApiService', () => {
  let injector: TestBed;
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService],
    });

    injector = getTestBed();
    service = injector.get(ApiService);
  });

});