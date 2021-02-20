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
import { GroupUsersComponent } from "@rapydo/components/group/group_users";
import { AdminModule } from "@rapydo/components/group/group.module";
import { User } from "@rapydo/types";

import { environment } from "@rapydo/../environments/environment";

describe("GroupUsersComponent", () => {
  let injector: TestBed;
  // let httpMock: HttpTestingController;
  let fixture: ComponentFixture<GroupUsersComponent>;
  let component: GroupUsersComponent;

  // const users: Array<User> = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule, HttpClientTestingModule],
    }).compileComponents();

    injector = getTestBed();
    // httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(GroupUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // const req = httpMock.expectOne(environment.backendURI + "/api/group/users");
    // expect(req.request.method).toEqual("GET");
    // req.flush(users);

    // httpMock.verify();
  }));

  it("component initialization", () => {
    expect(component).toBeDefined();
  });
});
