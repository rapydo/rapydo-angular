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
import { RegisterComponent } from "@rapydo/components/public/register";
import { PublicModule } from "@rapydo/components/public/public.module";

import { environment } from "@rapydo/../environments/environment";

describe("RegisterComponent", () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, PublicModule, HttpClientTestingModule],
    }).compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("component initialization", () => {
    expect(component).toBeDefined();
  });
});
