import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "@rapydo/shared.module";

import { RegisterComponent } from "@rapydo/components/public/register";
import { ResetPasswordComponent } from "@rapydo/components/public/reset";

const routes: Routes = [
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "register/:token",
    component: RegisterComponent,
  },
  {
    path: "reset",
    component: ResetPasswordComponent,
  },
  {
    path: "reset/:token",
    component: ResetPasswordComponent,
  },
];

@NgModule({
  declarations: [RegisterComponent, ResetPasswordComponent],
  exports: [RegisterComponent, ResetPasswordComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PublicModule {}
