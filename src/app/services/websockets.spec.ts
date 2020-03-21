import { TestBed, getTestBed } from '@angular/core/testing';
import { WebSocketsService } from '@rapydo/services/websockets';

describe('WebSocketsService', () => {
  let injector: TestBed;
  let service: WebSocketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketsService],
    });

    injector = getTestBed();
    service = injector.inject(WebSocketsService);
  });

});