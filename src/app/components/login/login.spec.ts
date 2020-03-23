import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from '@rapydo/app.module';
import { LoginComponent } from '@rapydo/components/login/login';
import { LoginModule } from '@rapydo/components/login/login.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // beforeEach(async(() => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, LoginModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

});

