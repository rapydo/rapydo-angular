import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "@rapydo/shared.module";
import { AuthGuard } from "@rapydo/app.auth.guard";

import { GroupUsersComponent } from "@rapydo/components/group/group_users";

const routes: Routes = [
  {
    path: "users",
    component: GroupUsersComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      roles: ["group_coordinator"],
      description: "Groups configuration",
    },
  },
];

@NgModule({
  declarations: [GroupUsersComponent],
  exports: [GroupUsersComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
