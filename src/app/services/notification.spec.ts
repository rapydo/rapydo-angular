import { TestBed, getTestBed } from "@angular/core/testing";
import { AppModule } from "@rapydo/app.module";
import { NotificationService } from "@rapydo/services/notification";

describe("NotificationService", () => {
  let injector: TestBed;
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
      imports: [AppModule],
    });

    injector = getTestBed();
    service = injector.inject(NotificationService);
  });

  it("showCritical", () => {
    service.showCritical("message");
    service.showCritical("message", "title");
    service.showCritical({ key: "message" });
    service.showCritical({ key: "message" }, "title");
  });

  it("showError", () => {
    service.showError("message");
    service.showError("message", "title");
    service.showError({ key: "message" });
    service.showError({ key: "message" }, "title");
  });

  it("showWarning", () => {
    service.showWarning("message");
    service.showWarning("message", "title");
    service.showWarning({ key: "message" });
    service.showWarning({ key: "message" }, "title");
  });

  it("showSuccess", () => {
    service.showSuccess("message");
    service.showSuccess("message", "title");
    service.showSuccess({ key: "message" });
    service.showSuccess({ key: "message" }, "title");
  });

  it("showInfo", () => {
    service.showInfo("message");
    service.showInfo("message", "title");
    service.showInfo({ key: "message" });
    service.showInfo({ key: "message" }, "title");
  });
});
