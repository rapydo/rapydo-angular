import { NgModule } from '@angular/core';

import { RapydoModule } from './rapydo.module'
import { CustomModule } from '/app/frontend/app/custom.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [ 
    RapydoModule,
    CustomModule
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ],
  providers: [ ],
})
export class AppModule { }
