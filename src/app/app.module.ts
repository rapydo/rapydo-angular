import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule, Routes, UrlHandlingStrategy } from '@angular/router';
import { UpgradeModule }  from '@angular/upgrade/static';
import { UpgradeAdapter } from '@angular/upgrade';

import { AppComponent } from './app.component';
import { ProfileComponent } from './app.profile';
import { TestComponent } from './app.test';


export class HybridUrlHandlingStrategy implements UrlHandlingStrategy {
  
  shouldProcessUrl(url) {
    return url.toString().startsWith("/new");
  }
  extract(url) { return url; }
  merge(url, whole) { return url; }
}

const appRoutes: Routes = [
  { path: 'new/test', component: TestComponent},
  { path: 'new/profile', component: ProfileComponent }
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
    ProfileComponent,
    TestComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy}
  ]
})
export class AppModule {

}

export const upgradeAdapter = new UpgradeAdapter(AppModule);

upgradeAdapter.upgradeNg1Provider('$rootScope');