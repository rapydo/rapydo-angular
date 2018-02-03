import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { UpgradeModule }  from '@angular/upgrade/static';

import { AppComponent } from './app.component';
import { TestComponent } from './app.test';
import { BlaComponent } from './app.bla';
import { FallbackNG1Component } from './app.fallback.ng1';

const appRoutes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'bla', component: BlaComponent },
  { path: '**', component: FallbackNG1Component }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false} // <-- debugging purposes only
    ),
    BrowserModule,
    UpgradeModule
  ],
  declarations: [
    AppComponent,
    FallbackNG1Component,
    BlaComponent, TestComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
