import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from '@rapydo/app.module';
import { SessionsComponent } from '@rapydo/components/profile/sessions';
import { ProfileModule } from '@rapydo/components/profile/profile.module';

describe('SessionsComponent', () => {
  let component: SessionsComponent;
  let fixture: ComponentFixture<SessionsComponent>;

  // beforeEach(async(() => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ProfileModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

});

