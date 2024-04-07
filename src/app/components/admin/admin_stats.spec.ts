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
import { AdminStatsComponent } from "@rapydo/components/admin/admin_stats";
import { AdminModule } from "@rapydo/components/admin/admin.module";
import { User } from "@rapydo/types";

import { environment } from "@rapydo/../environments/environment";

describe("AdminStatsComponent", () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<AdminStatsComponent>;
  let component: AdminStatsComponent;

  const stats = {
    system: {
      boot_time: "2020-08-11T08:08:05",
    },
    cpu: {
      count: 8,
      idle: 83,
      load_percentage: 22.62,
      stolen: 0,
      system: 0,
      user: 1,
      wait: 16,
    },
    disk: {
      free_disk_space: 2.39,
      occupacy: 87.49,
      total_disk_space: 19.21,
      used_disk_space: 16.81,
    },
    io: { blocks_received: 1, blocks_sent: 11 },
    network_latency: { avg: 10.6, max: 10.65, min: 10.54 },
    procs: { uninterruptible_sleep: 3, waiting_for_run: 0 },
    ram: {
      active: 3351,
      buffer: 261,
      cache: 5637,
      free: 15768,
      inactive: 4463,
      total: 24103,
      used: 2436,
    },
    swap: { free: 0, from_disk: 0, to_disk: 0, total: 0, used: 0 },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule, HttpClientTestingModule],
    }).compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne(environment.backendURI + "/api/admin/stats");
    expect(req.request.method).toEqual("GET");
    req.flush(stats);
    if (localizationReq.length > 0) {
      localizationReq.forEach((req) => req.flush({}));
    }
    httpMock.verify();
  }));

  it("component initialization", () => {
    expect(component).toBeDefined();
  });
});
