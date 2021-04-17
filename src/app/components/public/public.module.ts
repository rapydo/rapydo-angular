import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "@rapydo/shared.module";

import { RegisterComponent } from "@rapydo/components/public/register";
import { ResetPasswordComponent } from "@rapydo/components/public/reset";

const routes: Routes = [
  {
    path: "register",
    component: RegisterComponent,
    data: {
      description: "Register a new user",
    },
  },
  {
    path: "register/:token",
    component: RegisterComponent,
    data: {
      description: "Confirm registration",
    },
  },
  {
    path: "reset",
    component: ResetPasswordComponent,
    data: {
      description: "Reset password",
    },
  },
  {
    path: "reset/:token",
    component: ResetPasswordComponent,
    data: {
      description: "Confirm reset password",
    },
  },
];

@NgModule({
  declarations: [RegisterComponent, ResetPasswordComponent],
  exports: [RegisterComponent, ResetPasswordComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PublicModule {}
