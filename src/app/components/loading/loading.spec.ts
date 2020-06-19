import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { LoadingComponent } from "@rapydo/components/loading/loading";

// deprecated since 0.7.3
describe("LoadingComponent", () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("component initialization", () => {
    expect(component).toBeDefined();
  });
});
