import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { AdminLoginsComponent } from "@rapydo/components/admin/admin_logins";
import { AdminModule } from "@rapydo/components/admin/admin.module";

import { environment } from "@rapydo/../environments/environment";

describe("AdminLoginsComponent", () => {
  let fixture: ComponentFixture<AdminLoginsComponent>;
  let component: AdminLoginsComponent;

  beforeAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("component initialization", () => {
    expect(component).toBeDefined();
  });
});
