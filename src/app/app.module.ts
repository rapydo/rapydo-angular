import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, UrlHandlingStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UpgradeModule }  from '@angular/upgrade/static';
import { downgradeInjectable } from '@angular/upgrade/static';
import { UpgradeAdapter } from '@angular/upgrade';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import { MomentModule } from 'angular2-moment/moment.module';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AppComponent } from './app.component';

import { appRoutes } from './app.routes';
import { appRoutes as customRoutes } from '/app/frontend/app/app.routes';
import { declarations as customDeclarations } from '/app/frontend/app/app.declarations';

import { IteratePipe } from './app.pipes'

import { ProfileComponent } from './app.profile';
import { Error404Component } from './app.error.404';
import { OfflineComponent } from './app.error.offline';
import { ChangePasswordComponent } from './app.profile.changepassword';
import { SessionsComponent } from './app.profile.sessions';

import { HomeComponent } from '/app/frontend/app/app.home';
import { NavbarComponent } from './app.navbar';

import { TestComponent } from './app.test';

import { AuthGuard } from './app.auth.guard';
import { AuthService } from './app.auth.service';
import { ApiService } from './api.service';
import { FormlyService } from './app.formly.service';
import { NotificationService } from './app.notification.service';
import { TemplatingService } from './app.templating.service';
import { LoginComponent } from './login.component';
import { JwtInterceptor } from './jwt.interceptor';


export class HybridUrlHandlingStrategy implements UrlHandlingStrategy {
  
  shouldProcessUrl(url) {
    url = url.toString();

    if (url == '/') return true;
    if (url.toString().startsWith("/new")) return true;

    if (url.toString().startsWith("/app")) return false;

    return true;
  }
  extract(url) { return url; }
  merge(url, whole) { return url; }
}

var declarations = [
  AppComponent,
  LoginComponent,
  ProfileComponent, ChangePasswordComponent, SessionsComponent,
  HomeComponent, Error404Component, OfflineComponent,
  NavbarComponent,
  TestComponent,
  IteratePipe
];

declarations = declarations.concat(customDeclarations);
var routes = appRoutes.concat(customRoutes);
routes = routes.concat({path: '**', redirectTo: '/404', pathMatch: 'full'});

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: false} // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    FormlyModule, FormlyBootstrapModule,
    NgxDatatableModule,
    // import HttpClientModule after BrowserModule
    HttpClientModule,
    NgbModule.forRoot(),
    MomentModule,
    ConfirmationPopoverModule.forRoot(
      {confirmButtonType: 'danger'} // set defaults here
     ),
    UpgradeModule
  ],
  declarations: declarations,
  bootstrap: [ AppComponent ],
  providers: [
    AuthService, AuthGuard, ApiService, FormlyService, NotificationService, TemplatingService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy}
  ]
})
export class AppModule {

}

export const upgradeAdapter = new UpgradeAdapter(AppModule);

upgradeAdapter.upgradeNg1Provider('$rootScope');

import * as angular from "angular";
angular.module('web').factory("AuthService2", downgradeInjectable(AuthService) as any)
angular.module('web').factory("ApiService2", downgradeInjectable(ApiService) as any)
angular.module('web').factory("FormlyService2", downgradeInjectable(FormlyService) as any)
angular.module('web').factory("noty", downgradeInjectable(NotificationService) as any)