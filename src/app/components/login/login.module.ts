import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "@rapydo/shared.module";

import { LoginComponent } from "@rapydo/components/login/login";
import { LoginUnlockComponent } from "@rapydo/components/login/login_unlock";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "unlock/:token",
    component: LoginUnlockComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, LoginUnlockComponent],
  exports: [LoginComponent, LoginUnlockComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class LoginModule {}
