import { TestBed, getTestBed } from '@angular/core/testing';
import { AppModule } from '@rapydo/app.module';
import { NotificationService} from '@rapydo/services/notification';

describe('NotificationService', () => {
  let injector: TestBed;
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
      imports: [AppModule]
    });

    injector = getTestBed();
    service = injector.get(NotificationService);
  });

  it('showCritical', () => {
    service.showCritical('message');
    service.showCritical('message', 'title');
  });

  it('showError', () => {
    service.showError('message');
    service.showError('message', 'title');
  });

  it('showWarning', () => {
    service.showWarning('message');
    service.showWarning('message', 'title');
  });

  it('showSuccess', () => {
    service.showSuccess('message');
    service.showSuccess('message', 'title');
  });

  it('showInfo', () => {
    service.showInfo('message');
    service.showInfo('message', 'title');
  });

});