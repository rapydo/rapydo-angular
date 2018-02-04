import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule, Routes, UrlHandlingStrategy } from '@angular/router';
import { UpgradeModule }  from '@angular/upgrade/static';

import { AppComponent } from './app.component';
import { TestComponent } from './app.test';
import { BlaComponent } from './app.bla';


export class HybridUrlHandlingStrategy implements UrlHandlingStrategy {
  
  shouldProcessUrl(url) {
    return url.toString().startsWith("/new");
  }
  extract(url) { return url; }
  merge(url, whole) { return url; }
}

const appRoutes: Routes = [
  { path: 'new/test', component: TestComponent},
  { path: 'new/bla', component: BlaComponent }
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
    BlaComponent, TestComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy}
  ]
})
export class AppModule {

}
