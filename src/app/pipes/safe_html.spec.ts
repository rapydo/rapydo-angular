import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DomSanitizer } from "@angular/platform-browser";
import { AppModule } from "@rapydo/app.module";
import { SafeHtmlPipe } from "@rapydo/pipes/safe_html";

describe("Pipes", () => {
  let safe_html_pipe: SafeHtmlPipe;

  beforeEach(() => {
    safe_html_pipe = new SafeHtmlPipe({} as DomSanitizer);
  });

  it("SafeHtmlPipe", () => {});
});
