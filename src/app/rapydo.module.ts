import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

import { RouterModule, Routes } from '@angular/router';

import { MomentModule } from 'ngx-moment';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ClipboardModule } from 'ngx-clipboard';

import { FormsModule, FormControl } from '@angular/forms';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { IteratePipe, BytesPipe } from './pipes/pipes'

import { Error404Component } from './components/errors/404';
import { OfflineComponent } from './components/errors/offline';
import { LoadingComponent } from './components/loading/loading';

import { BasePaginationComponent } from './components/base.pagination.component';
import { ProfileComponent } from './components/profile/profile';
import { ChangePasswordComponent } from './components/profile/changepassword';
import { SessionsComponent } from './components/profile/sessions';

import { NavbarComponent } from './components/navbar/navbar';

import { AdminUsersComponent } from './components/admin_users/admin_users';
import { LoginComponent } from './components/login/login';
import { ResetPasswordComponent } from './components/login/reset';
import { RegisterComponent } from './components/register/register';

import { AuthGuard } from './app.auth.guard';
import { AuthService } from './services/auth';
import { ApiService } from './services/api';
import { FormlyService } from './services/formly';
import { NotificationService } from './services/notification';

import { JwtInterceptor } from './jwt.interceptor';

import { FormlyHorizontalWrapper } from './components/forms/bootstrap.horizontal.wrapper'
import { FileValueAccessor } from './components/forms/file-value-accessor';
import { FormlyFieldFile } from './components/forms/file-type.component';
import { FormlyDescriptiveRadio } from './components/forms/radio-type.component';
import { TermsOfUseCheckbox } from './components/forms/terms_of_use_checkbox'

import { CustomNavbarComponent } from '/app/frontend/app/custom.navbar';
import { CustomBrandComponent } from '/app/frontend/app/custom.navbar';
import { ProjectOptions } from '/app/frontend/app/custom.project.options';

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

  return /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(control.value) ? null : {'url': true};

  /*
    Regular expression obtained from https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url

    Just adoded a '?' after protocols to make schema optional (i.e. www.google.com is valid)

    How it works
      // protocol identifier
      "(?:(?:(?:https?|ftp):)?//)"
      // user:pass authentication
      "(?:\\S+(?::\\S*)?@)?"
      "(?:"
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})"
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})"
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})"
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])"
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}"
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))"
      "|"
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)"
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*"
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))"
      // port number
      "(?::\\d{2,5})?"
      // resource path
      "(?:[/?#]\\S*)?"
    */
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


const routes: Routes = [
  {
    path: '404', component: Error404Component
  },
  {
    path: 'offline', component: OfflineComponent
  },
  {
    path: 'app/login', component: LoginComponent
  },
  {
    path: 'public/register', component: RegisterComponent
  },
  {
    path: 'public/register/:token', component: RegisterComponent
  },
  {
    path: 'public/reset', component: ResetPasswordComponent
  },
  {
    path: 'public/reset/:token', component: ResetPasswordComponent
  },
  {
    path: 'app/profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'app/profile/changepassword',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'app/profile/sessions',
    component: SessionsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'app/admin/users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { roles: ['admin_root', 'local_admin'] }
  }/*,
  {
  	path: '**',
  	redirectTo: '/404',
  	pathMatch: 'full'
  }*/

];

@NgModule({
  imports: [
	CommonModule,

    RouterModule.forRoot(
      routes,
      {
        enableTracing: false,
        onSameUrlNavigation: 'reload'
       } // <-- debugging purposes only
    ),

    BrowserModule,

    // import HttpClientModule after BrowserModule
    HttpClientModule,
    NgbModule.forRoot(),
    MomentModule,
    NgxDatatableModule,
    ConfirmationPopoverModule.forRoot(
      // set defaults here
      {
        confirmButtonType: 'danger',
        appendToBody: true
      }
    ),
    ClipboardModule,
    FormsModule, ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      types: [
        { name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] }, 
        { name: 'radio', component: FormlyDescriptiveRadio }, 
        { name: 'terms_of_use', component: TermsOfUseCheckbox }
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
  ],
  declarations: [
	IteratePipe, BytesPipe,
	Error404Component, OfflineComponent, LoadingComponent,
	LoginComponent, ResetPasswordComponent, RegisterComponent,
	ProfileComponent, ChangePasswordComponent, SessionsComponent,
	BasePaginationComponent,
	NavbarComponent,
	AdminUsersComponent,
	FormlyHorizontalWrapper,
	FileValueAccessor,
	FormlyFieldFile,
	FormlyDescriptiveRadio,
	TermsOfUseCheckbox,

	CustomNavbarComponent,
	CustomBrandComponent
  ],

  exports: [
  	CommonModule,
  	RouterModule,
  	BrowserModule,
  	HttpClientModule,
  	NgbModule,
    MomentModule,
	NgxDatatableModule,
    ConfirmationPopoverModule, 
    ClipboardModule,

	IteratePipe, BytesPipe,

	Error404Component, OfflineComponent, LoadingComponent,
	LoginComponent, ResetPasswordComponent, RegisterComponent,
	ProfileComponent, ChangePasswordComponent, SessionsComponent,
	BasePaginationComponent,
	NavbarComponent,
	AdminUsersComponent,

	FormlyHorizontalWrapper,
	FileValueAccessor,
	FormlyFieldFile,
	FormlyDescriptiveRadio,
	TermsOfUseCheckbox,
	FormsModule, ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule
  ],
  providers: [
	AuthService, AuthGuard,
	ApiService,
	FormlyService,
	NotificationService,
	ProjectOptions,
	{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
})
export class RapydoModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RapydoModule,
	  providers: [
		  AuthService, AuthGuard,
		  ApiService,
		  FormlyService,
		  NotificationService,
		  ProjectOptions,
		  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
	  ],
    };
  }
} 