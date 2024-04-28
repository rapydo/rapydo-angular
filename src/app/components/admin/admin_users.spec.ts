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
import { AdminUsersComponent } from "@rapydo/components/admin/admin_users";
import { AdminModule } from "@rapydo/components/admin/admin.module";
import { User } from "@rapydo/types";

import { environment } from "@rapydo/../environments/environment";

describe("AdminUsersComponent", () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let component: AdminUsersComponent;

  const users: Array<User> = [];

  const mock204Response = {
    status: 204,
    statusText: "NO_CONTENT",
  };
  const mock404Response = {
    status: 404,
    statusText: "NOT_FOUND",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule, HttpClientTestingModule],
    }).compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne(environment.backendURI + "/api/admin/users");
    expect(req.request.method).toEqual("GET");
    req.flush(users);
    const localizationReq = httpMock.match("app/rapydo/assets/i18n/en.json");
    if (localizationReq.length > 0) {
      localizationReq.forEach((req) => req.flush({}));
    }
    httpMock.verify();
  }));

  it("component initialization", () => {
    expect(component).toBeDefined();
  });

  // it('delete data', () => {
  //   component.remove("y");
  //   const req1 = httpMock.expectOne(environment.backendURI + '/api/admin/users');
  //   expect(req1.request.method).toEqual('DELETE');
  //   req1.flush('', mock404Response);

  //   component.remove("x");
  //   const req2 = httpMock.expectOne(environment.backendURI + '/api/admin/users');
  //   expect(req2.request.method).toEqual('DELETE');
  //   req2.flush('', mock204Response);

  // });
});
