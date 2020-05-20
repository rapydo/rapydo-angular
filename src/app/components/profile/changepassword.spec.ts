import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppModule } from '@rapydo/app.module';
import { ChangePasswordComponent } from '@rapydo/components/profile/changepassword';
import { ProfileModule } from '@rapydo/components/profile/profile.module';

import { environment } from '@rapydo/../environments/environment'

describe('ChangePasswordComponent', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let component: ChangePasswordComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ProfileModule, HttpClientTestingModule]
    })
    .compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('component initialization', () => {
    expect(component).toBeDefined();
  });


});

