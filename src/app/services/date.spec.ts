import { TestBed, getTestBed } from "@angular/core/testing";
import { AppModule } from "@rapydo/app.module";
import { DateService } from "@rapydo/services/date";

describe("DateService", () => {
  let injector: TestBed;
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService],
      imports: [AppModule],
    });

    injector = getTestBed();
    service = injector.inject(DateService);
  });

  it("convertDate", async () => {
    expect(
      service.toUTCString("2023-01-14T00:00:00.000Z", "yyyy-MM-dd")
    ).toEqual("2023-01-14");
  });
});
