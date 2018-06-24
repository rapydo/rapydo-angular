import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule, FormControl } from '@angular/forms';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { RouterModule, Routes, UrlHandlingStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';

// import { UpgradeModule }  from '@angular/upgrade/static';
// import { downgradeInjectable } from '@angular/upgrade/static';
// import { UpgradeAdapter } from '@angular/upgrade';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import { MomentModule } from 'ngx-moment';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ConfirmationModalModule } from 'ng-confirmation-modal';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AppComponent } from './app.component';

import { appRoutes } from './rapydo.routes';

import { appRoutes as customRoutes } from '/app/frontend/app/custom.routes';

import { declarations as customDeclarations } from '/app/frontend/app/custom.declarations';
import { providers as customProviders } from '/app/frontend/app/custom.declarations';
import { entryComponents as customEntryComponents } from '/app/frontend/app/custom.declarations';
import { imports as customImports } from '/app/frontend/app/custom.declarations';

import { IteratePipe, BytesPipe } from './pipes/pipes'

import { Error404Component } from './components/errors/404';
import { OfflineComponent } from './components/errors/offline';
import { BasePaginationComponent } from './components/base.pagination.component';

import { LoadingComponent } from './components/loading/loading';

import { FormlyHorizontalWrapper } from './components/forms/bootstrap.horizontal.wrapper'
import { AutocompleteComponent } from './components/forms/autocomplete'

import { ProfileComponent } from './components/profile/profile';
import { ChangePasswordComponent } from './components/profile/changepassword';
import { SessionsComponent } from './components/profile/sessions';

import { NavbarComponent } from './components/navbar/navbar';

import { AdminUsersComponent } from './components/admin_users/admin_users';

import { AuthGuard } from './app.auth.guard';
import { AuthService } from './services/auth';
import { ApiService } from './services/api';
import { FormlyService } from './services/formly';
import { NotificationService } from './services/notification';
import { LoginComponent } from './components/login/login';
import { ResetPasswordComponent } from './components/login/reset';
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

export function emailValidator(control: FormControl): ValidationErrors {
  /*
    - first chr of name is a letter
    - other chr allowed in name after the first: letters, number, . _ -
    - required @
    - first chr of domain is a letter or number (@163.com)
    - other chr allowed in domain after the first: letters, number, _ -
    - required a .
    - domain block can be repeated (letter/number)+(letters/numbers/-_).
    - required from 2 to 5 letters after the last . 
  */
  return /^[a-zA-Z]+[a-zA-Z0-9._-]*@[a-zA-Z0-9]+[a-zA-Z0-9_-]*\.([a-zA-Z0-9]+[a-zA-Z0-9_-]*\.)*[a-zA-Z]{2,5}$/.test(control.value) ? null : {'email': true};
}

export function URLValidator(control: FormControl): ValidationErrors {

  if (control.value == null)
    return null;

  return /^[a-z.]+$/.test(control.value) ? null : {'url': true};
}

export function minLengthValidationError(error, field) {
  return `Should have at least ${field.templateOptions.minLength} characters`;
}

export function maxLengthValidationError(error, field) {
  return `Should have no more than ${field.templateOptions.maxLength} characters`;
}

export function minValidationError(error, field) {
  return `Should be greater than ${field.templateOptions.min}`;
}

export function maxValidationError(error, field) {
  return `Should be lower than ${field.templateOptions.max}`;
}

let declarations = [
  AppComponent,
  LoginComponent, ResetPasswordComponent,
  ProfileComponent, ChangePasswordComponent, SessionsComponent,
  Error404Component, OfflineComponent, LoadingComponent,
  BasePaginationComponent,
  NavbarComponent,
  AdminUsersComponent,
  IteratePipe, BytesPipe,
  FormlyHorizontalWrapper,
  AutocompleteComponent
];

declarations = declarations.concat(customDeclarations);

let providers = [
  AuthService, AuthGuard, ApiService, FormlyService, NotificationService,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  // { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy}
];

providers = providers.concat(customProviders);

let entryComponents = [];
entryComponents = entryComponents.concat(customEntryComponents);

let routes = appRoutes.concat(customRoutes);
routes = routes.concat({path: '**', redirectTo: '/404', pathMatch: 'full'});

let imports = [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: false,
        onSameUrlNavigation: 'reload'
       } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    ClipboardModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      types: [
        { name: 'autocomplete', component: AutocompleteComponent }
      ],
      validationMessages: [
        {name: 'required', message: 'This field is required'},
        {name: 'minlength', message: minLengthValidationError},
        {name: 'maxlength', message: maxLengthValidationError},
        {name: 'min', message: minValidationError},
        {name: 'max', message: maxValidationError},
        {name: 'email', message: 'Invalid email address'},
        {name: 'url', message: 'Invalid web address'},
      ],
      validators: [
        {name: 'email', validation: emailValidator},
        {name: 'url', validation: URLValidator}
      ],
      wrappers: [
        {name: 'form-field-horizontal', component: FormlyHorizontalWrapper}
      ]
    }),
    NgxDatatableModule,
    // import HttpClientModule after BrowserModule
    HttpClientModule,
    NgbModule.forRoot(),
    MomentModule,
    ConfirmationPopoverModule.forRoot(
      {confirmButtonType: 'danger'} // set defaults here
    ),
    ConfirmationModalModule.forRoot({
      //optional global config

      //confirmBtnClass: 'btn btn-success',
      //confirmBtnText: 'Confirm',
      //cancelBtnClass: 'btn btn-danger',
      //cancelBtnText: 'Cancel',
      //modalSize: 'lg',
      modalSize: 'md',
      //modalClass: 'some-modal-class'
    })
    // UpgradeModule
];

imports = imports.concat(customImports);


@NgModule({
  imports: imports,
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