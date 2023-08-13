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
import { AdminGroupsComponent } from "@rapydo/components/admin/admin_groups";
import { AdminModule } from "@rapydo/components/admin/admin.module";
import { Group } from "@rapydo/types";

import { environment } from "@rapydo/../environments/environment";

describe("AdminGroupsComponent", () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<AdminGroupsComponent>;
  let component: AdminGroupsComponent;

  const groups: Array<Group> = [
    {
      uuid: "x",
      shortname: "A",
      fullname: "AAA",
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule, HttpClientTestingModule],
    }).compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne(
      environment.backendURI + "/api/admin/groups",
    );
    expect(req.request.method).toEqual("GET");
    req.flush(groups);

    httpMock.verify();
  }));

  it("component initialization", () => {
    expect(component).toBeDefined();
  });
});
