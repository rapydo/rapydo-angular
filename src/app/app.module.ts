import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, UrlHandlingStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { UpgradeModule }  from '@angular/upgrade/static';
// import { downgradeInjectable } from '@angular/upgrade/static';
// import { UpgradeAdapter } from '@angular/upgrade';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import { MomentModule } from 'angular2-moment/moment.module';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AppComponent } from './app.component';

import { appRoutes } from './rapydo.routes';
import { appRoutes as customRoutes } from '/app/frontend/app/app.routes';
import { declarations as customDeclarations } from '/app/frontend/app/app.declarations';
import { providers as customProviders } from '/app/frontend/app/app.providers';
import { entryComponents as customEntryComponents } from '/app/frontend/app/app.entryComponents';

import { IteratePipe, BytesPipe } from './pipes/pipes'

import { Error404Component } from './components/errors/404';
import { OfflineComponent } from './components/errors/offline';

import { ProfileComponent } from './components/profile/profile';
import { ChangePasswordComponent } from './components/profile/changepassword';
import { SessionsComponent } from './components/profile/sessions';

import { HomeComponent } from '/app/frontend/app/app.home';
import { NavbarComponent } from './components/navbar/navbar';

import { AdminUsersComponent } from './components/admin_users/admin_users';

import { AuthGuard } from './app.auth.guard';
import { AuthService } from './services/auth';
import { ApiService } from './services/api';
import { FormlyService } from './services/formly';
import { NotificationService } from './services/notification';
import { TemplatingService } from './services/templating';
import { LoginComponent } from './components/login/login';
import { JwtInterceptor } from './jwt.interceptor';

/*
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
*/
var declarations = [
  AppComponent,
  LoginComponent,
  ProfileComponent, ChangePasswordComponent, SessionsComponent,
  HomeComponent, Error404Component, OfflineComponent,
  NavbarComponent,
  IteratePipe, BytesPipe
];

declarations = declarations.concat(customDeclarations);

var providers = [
  AuthService, AuthGuard, ApiService, FormlyService, NotificationService, TemplatingService,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  // { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy}
];

providers = providers.concat(customProviders);

var entryComponents = [];
entryComponents = entryComponents.concat(customEntryComponents);

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
    // UpgradeModule
  ],
  declarations: declarations,
  bootstrap: [ AppComponent ],
  entryComponents: entryComponents,
  providers: providers,
})
export class AppModule {

}
/*
export const upgradeAdapter = new UpgradeAdapter(AppModule);

upgradeAdapter.upgradeNg1Provider('$rootScope');

import * as angular from "angular";
angular.module('web').factory("AuthService2", downgradeInjectable(AuthService) as any)
angular.module('web').factory("ApiService2", downgradeInjectable(ApiService) as any)
angular.module('web').factory("FormlyService2", downgradeInjectable(FormlyService) as any)
angular.module('web').factory("noty", downgradeInjectable(NotificationService) as any)*/