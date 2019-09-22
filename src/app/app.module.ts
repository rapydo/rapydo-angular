import { NgModule, Injector } from '@angular/core';

import { RapydoModule } from './rapydo.module'
import { PageNotFoundModule } from './404.module'
import { CustomModule } from '@app/custom.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [ 
  	RapydoModule.forRoot(),
    // RapydoModule,
    CustomModule,
    PageNotFoundModule
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ],
  providers: [ ],
})
export class AppModule {
    /**
     * Allows for retrieving singletons using `AppModule.injector.get(MyService)`
     * This is good to prevent injecting the service as constructor parameter.
     */
    static injector: Injector;
    constructor(injector: Injector) {
        AppModule.injector = injector;
    }
}
