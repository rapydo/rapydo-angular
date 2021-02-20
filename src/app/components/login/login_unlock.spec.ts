import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
} from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { LoginUnlockComponent } from "@rapydo/components/login/login_unlock";
import { LoginModule } from "@rapydo/components/login/login.module";

describe("LoginUnlockComponent", () => {
  let injector: TestBed;
  let fixture: ComponentFixture<LoginUnlockComponent>;
  let component: LoginUnlockComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, LoginModule],
    }).compileComponents();

    injector = getTestBed();
    fixture = TestBed.createComponent(LoginUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("component initialization", () => {
    expect(component).toBeDefined();
  });
});
