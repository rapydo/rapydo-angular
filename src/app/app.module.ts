import { NgModule } from '@angular/core';

import { RapydoModule } from './rapydo.module'
import { PageNotFoundModule } from './404.module'
import { CustomModule } from '/app/frontend/app/custom.module';

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
export class AppModule { }
