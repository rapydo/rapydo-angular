import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, UrlHandlingStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UpgradeModule }  from '@angular/upgrade/static';
import { UpgradeAdapter } from '@angular/upgrade';

import { AppComponent } from './app.component';

import { ProfileComponent } from './app.profile';
import { NavbarComponent } from './app.navbar';
import { TestComponent } from './app.test';

import { AuthGuard } from './app.auth.guard';
import { AuthService } from './app.auth.service';
import { LoginComponent } from './login.component';
import { JwtInterceptor } from './jwt.interceptor';


export class HybridUrlHandlingStrategy implements UrlHandlingStrategy {
  
  shouldProcessUrl(url) {
    return url.toString().startsWith("/new");
  }
  extract(url) { return url; }
  merge(url, whole) { return url; }
}

const appRoutes: Routes = [
  {
    path: 'new/login', component: LoginComponent
  },
  {
    path: 'new/test',
    component: TestComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    }
  },
  {
    path: 'new/profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false} // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    // import HttpClientModule after BrowserModule
    HttpClientModule,
    UpgradeModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    NavbarComponent,
    TestComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    AuthService, AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy}
  ]
})
export class AppModule {

}

export const upgradeAdapter = new UpgradeAdapter(AppModule);

upgradeAdapter.upgradeNg1Provider('$rootScope');