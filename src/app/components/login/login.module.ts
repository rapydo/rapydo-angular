import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "@rapydo/shared.module";

import { LoginComponent } from "@rapydo/components/login/login";
import { LoginUnlockComponent } from "@rapydo/components/login/login_unlock";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    data: {
      description: "Login",
    },
  },
  {
    path: "unlock/:token",
    component: LoginUnlockComponent,
    data: {
      description: "Unlock login",
    },
  },
];

@NgModule({
  declarations: [LoginComponent, LoginUnlockComponent],
  exports: [LoginComponent, LoginUnlockComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class LoginModule {}
