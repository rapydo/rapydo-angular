import { NgModule, Injector } from "@angular/core";
import { NgbConfig } from "@ng-bootstrap/ng-bootstrap";

import { RapydoModule } from "@rapydo/rapydo.module";
import { PageNotFoundModule } from "@rapydo/components/errors/404.module";
import { CustomModule } from "@app/custom.module";

import { AppComponent } from "@rapydo/app.component";

@NgModule({
  imports: [RapydoModule.forRoot(), CustomModule, PageNotFoundModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  exports: [AppComponent],
  providers: [],
})
export class AppModule {
  /**
   * Allows for retrieving singletons using `AppModule.injector.get(MyService)`
   * This is good to prevent injecting the service as constructor parameter.
   */
  static injector: Injector;
  constructor(injector: Injector, ngbConfig: NgbConfig) {
    AppModule.injector = injector;
    ngbConfig.animation = false;
  }
}
