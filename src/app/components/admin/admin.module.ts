import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "@rapydo/shared.module";
import { AuthGuard } from "@rapydo/app.auth.guard";

import { AdminUsersComponent } from "@rapydo/components/admin/admin_users";
import { AdminGroupsComponent } from "@rapydo/components/admin/admin_groups";
import { AdminSessionsComponent } from "@rapydo/components/admin/admin_sessions";
import { AdminStatsComponent } from "@rapydo/components/admin/admin_stats";

const routes: Routes = [
  {
    path: "users",
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: { roles: ["admin_root"] },
  },
  {
    path: "groups",
    component: AdminGroupsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: { roles: ["admin_root"] },
  },
  {
    path: "sessions",
    component: AdminSessionsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: { roles: ["admin_root"] },
  },
  {
    path: "stats",
    component: AdminStatsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: { roles: ["admin_root"] },
  },
];

@NgModule({
  declarations: [
    AdminUsersComponent,
    AdminGroupsComponent,
    AdminSessionsComponent,
    AdminStatsComponent,
  ],
  exports: [
    AdminUsersComponent,
    AdminGroupsComponent,
    AdminSessionsComponent,
    AdminStatsComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
