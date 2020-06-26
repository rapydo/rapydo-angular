import {
  NgModule,
  ModuleWithProviders,
  Injectable,
  ErrorHandler,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { CookieLawModule } from "angular2-cookie-law";
import { ToastrModule } from "ngx-toastr";
import { DeviceDetectorModule } from "ngx-device-detector";
import * as Sentry from "@sentry/browser";
// import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

import { SharedModule } from "@rapydo/shared.module";
import { NavbarComponent } from "@rapydo/components/navbar/navbar";

import { AuthGuard } from "@rapydo/app.auth.guard";
import { AuthService } from "@rapydo/services/auth";
import { ApiService } from "@rapydo/services/api";
import { FormlyService } from "@rapydo/services/formly";
import { NotificationService } from "@rapydo/services/notification";
import { WebSocketsService } from "@rapydo/services/websockets";

import { JwtInterceptor } from "@rapydo/jwt.interceptor";

import { CustomNavbarComponent } from "@app/custom.navbar";
import { CustomBrandComponent } from "@app/custom.navbar";
import { CustomFooterComponent } from "@app/custom.footer";
import { ProjectOptions } from "@app/custom.project.options";

import { environment } from "@rapydo/../environments/environment";

const routes: Routes = [
  {
    path: "public",
    loadChildren: () =>
      import("@rapydo/components/public/public.module").then(
        (m) => m.PublicModule
      ),
  },
  {
    path: "app/login",
    loadChildren: () =>
      import("@rapydo/components/login/login.module").then(
        (m) => m.LoginModule
      ),
  },
  {
    path: "app/profile",
    loadChildren: () =>
      import("@rapydo/components/profile/profile.module").then(
        (m) => m.ProfileModule
      ),
  },
  {
    path: "app/admin",
    loadChildren: () =>
      import("@rapydo/components/admin/admin.module").then(
        (m) => m.AdminModule
      ),
  },
];

let module_imports: any = [
  CommonModule,
  SharedModule,

  RouterModule.forRoot(
    routes,
    {
      enableTracing: false,
      onSameUrlNavigation: "reload",
    } // <-- debugging purposes only
  ),

  // BrowserModule,
  BrowserAnimationsModule, // required by CookieLaw and Toastr

  // import HttpClientModule after BrowserModule
  HttpClientModule,
  CookieLawModule,
  ToastrModule.forRoot({
    maxOpened: 5,
    preventDuplicates: true,
    countDuplicates: true,
    resetTimeoutOnDuplicate: true,
    closeButton: true,
    enableHtml: true,
    progressBar: true,
    progressAnimation: "increasing",
    positionClass: "toast-bottom-right",
  }),

  // NgxGoogleAnalyticsModule.forRoot(environment.GA_TRACKING_CODE),
  // NgxGoogleAnalyticsRouterModule,
  DeviceDetectorModule.forRoot(),
];

let module_declarations = [
  NavbarComponent,

  CustomNavbarComponent,
  CustomBrandComponent,
  CustomFooterComponent,
];

let module_exports = [
  CommonModule,
  RouterModule,
  // BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  CookieLawModule,
  ToastrModule,

  NavbarComponent,
  CustomFooterComponent,
];

let module_providers: any = [
  AuthService,
  AuthGuard,
  ApiService,
  FormlyService,
  NotificationService,
  WebSocketsService,
  ProjectOptions,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
];

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    if (
      environment.production &&
      typeof environment.SENTRY_URL !== "undefined" &&
      environment.SENTRY_URL != ""
    ) {
      Sentry.captureException(error.originalError || error);
    }
    throw error;
  }
}

if (
  environment.production &&
  typeof environment.SENTRY_URL !== "undefined" &&
  environment.SENTRY_URL != ""
) {
  Sentry.init({
    dsn: environment.SENTRY_URL,
  });

  module_providers.push({
    provide: ErrorHandler,
    useClass: SentryErrorHandler,
  });
}

@NgModule({
  imports: module_imports,
  declarations: module_declarations,
  exports: module_exports,
  providers: module_providers,
})
export class RapydoModule {
  static forRoot(): ModuleWithProviders<RapydoModule> {
    return {
      ngModule: RapydoModule,
      providers: module_providers,
    };
  }
}
