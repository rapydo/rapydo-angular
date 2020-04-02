import { TestBed, getTestBed } from '@angular/core/testing';
import { NotificationService} from '@rapydo/services/notification';

describe('NotificationService', () => {
  let injector: TestBed;
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService],
    });

    injector = getTestBed();
    service = injector.get(NotificationService);
  });

  it('showCritical', () => {
    service.showCritical('message').subscribe((res) => {
    });
    service.showCritical('message', 'title').subscribe((res) => {
    });
  });

  it('showError', () => {
    service.showError('message').subscribe((res) => {
    });
    service.showError('message', 'title').subscribe((res) => {
    });
  });

  it('showWarning', () => {
    service.showWarning('message').subscribe((res) => {
    });
    service.showWarning('message', 'title').subscribe((res) => {
    });
  });

  it('showSuccess', () => {
    service.showSuccess('message').subscribe((res) => {
    });
    service.showSuccess('message', 'title').subscribe((res) => {
    });
  });

  it('showInfo', () => {
    service.showInfo('message').subscribe((res) => {
    });
    service.showInfo('message', 'title').subscribe((res) => {
    });
  });

});