import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
} from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { AppModule } from "@rapydo/app.module";
import { LoginComponent } from "@rapydo/components/login/login";
import { LoginModule } from "@rapydo/components/login/login.module";

import { environment } from "@rapydo/../environments/environment";

describe("LoginComponent", () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, LoginModule, HttpClientTestingModule],
    }).compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("component initialization", () => {
    expect(component).toBeDefined();
  });

  it("form invalid when empty", () => {
    expect(component.form.valid).toBeFalsy();
  });
});
