import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
} from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { AdminStatsComponent } from "@rapydo/components/admin/admin_stats";
import { AdminModule } from "@rapydo/components/admin/admin.module";
import { User } from "@rapydo/services/auth";

import { environment } from "@rapydo/../environments/environment";

describe("AdminStatsComponent", () => {
  let injector: TestBed;
  let fixture: ComponentFixture<AdminStatsComponent>;
  let component: AdminStatsComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule],
    }).compileComponents();

    injector = getTestBed();
    fixture = TestBed.createComponent(AdminStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  /*
  it("component initialization", () => {
    expect(component).toBeDefined();
  });
*/
});
