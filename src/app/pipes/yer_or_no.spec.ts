import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { YesNoPipe } from "@rapydo/pipes/yes_or_no";
import { LoginModule } from "@rapydo/components/login/login.module";

describe("Pipes", () => {
  let yesno_pipe: YesNoPipe;

  beforeEach(() => {
    yesno_pipe = new YesNoPipe();
  });

  it("YesNoPipe", () => {
    expect(yesno_pipe.transform(true)).toBe("YES");
    expect(yesno_pipe.transform(false)).toBe("NO");
    expect(yesno_pipe.transform("XYZ")).toBe("XYZ");
  });
});
