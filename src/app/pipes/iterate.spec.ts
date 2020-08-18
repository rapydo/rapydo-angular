import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { IteratePipe } from "@rapydo/pipes/iterate";
import { LoginModule } from "@rapydo/components/login/login.module";

describe("Pipes", () => {
  let iterate_pipe: IteratePipe;

  beforeEach(() => {
    iterate_pipe = new IteratePipe();
  });

  it("IteratePipe", () => {});
});
