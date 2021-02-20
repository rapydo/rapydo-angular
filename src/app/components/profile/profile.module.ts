import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "@rapydo/shared.module";
import { AuthGuard } from "@rapydo/app.auth.guard";

import { ProfileComponent } from "@rapydo/components/profile/profile";
import { ChangePasswordComponent } from "@rapydo/components/profile/changepassword";
import { SessionsComponent } from "@rapydo/components/profile/sessions";

import { CustomProfileComponent } from "@app/custom.profile";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      description: "Your profile",
    },
  },
  {
    path: "changepassword",
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      description: "Change your password",
    },
  },
  {
    path: "sessions",
    component: SessionsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      description: "Your open sessions",
    },
  },
];

@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    SessionsComponent,
    CustomProfileComponent,
  ],
  exports: [
    ProfileComponent,
    ChangePasswordComponent,
    SessionsComponent,
    CustomProfileComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ProfileModule {}
