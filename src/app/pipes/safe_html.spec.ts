import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { SafeHtmlPipe } from "@rapydo/pipes/safe_html";

describe("Pipes", () => {
  let safe_html_pipe: SafeHtmlPipe;

  beforeEach(() => {
    safe_html_pipe = new SafeHtmlPipe();
  });

  it("SafeHtmlPipe", () => {});
});
