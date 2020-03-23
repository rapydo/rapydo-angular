import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from '@rapydo/app.module';
import { ProfileComponent } from '@rapydo/components/profile/profile';
import { ProfileModule } from '@rapydo/components/profile/profile.module';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  // beforeEach(async(() => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ProfileModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

});

