import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { BooleanFlagPipe } from "@rapydo/pipes/boolean_flag";
import { LoginModule } from "@rapydo/components/login/login.module";

describe("Pipes", () => {
  let boolean_pipe: BooleanFlagPipe;

  beforeEach(() => {
    boolean_pipe = new BooleanFlagPipe();
  });

  it("BooleanFlagPipe", () => {
    expect(boolean_pipe.transform(true)).toBe(
      "<i class='fas fa-check fa-lg green'></i>"
    );
    expect(boolean_pipe.transform(false)).toBe(
      "<i class='fas fa-times fa-lg red'></i>"
    );
    expect(boolean_pipe.transform("XYZ")).toBe("XYZ");
  });
});
