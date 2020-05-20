import { async, ComponentFixture, TestBed, getTestBed} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppModule } from '@rapydo/app.module';
import { ResetPasswordComponent } from '@rapydo/components/public/reset';
import { PublicModule } from '@rapydo/components/public/public.module';

import { environment } from '@rapydo/../environments/environment'

describe('ResetPasswordComponent', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let component: ResetPasswordComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, PublicModule, HttpClientTestingModule]
    })
    .compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('component initialization', () => {
    expect(component).toBeDefined();
  });

});

