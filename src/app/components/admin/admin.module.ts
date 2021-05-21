import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "@rapydo/shared.module";
import { AuthGuard } from "@rapydo/app.auth.guard";

import { AdminUsersComponent } from "@rapydo/components/admin/admin_users";
import { AdminGroupsComponent } from "@rapydo/components/admin/admin_groups";
import { AdminSessionsComponent } from "@rapydo/components/admin/admin_sessions";
import { AdminStatsComponent } from "@rapydo/components/admin/admin_stats";
import { AdminMailComponent } from "@rapydo/components/admin/admin_mail";
import { AdminLoginsComponent } from "@rapydo/components/admin/admin_logins";

const routes: Routes = [
  {
    path: "users",
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      roles: ["admin_root"],
      description: "Users configuration",
    },
  },
  {
    path: "groups",
    component: AdminGroupsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      roles: ["admin_root"],
      description: "Groups configuration",
    },
  },
  {
    path: "sessions",
    component: AdminSessionsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      roles: ["admin_root"],
      description: "Sessions management",
    },
  },
  {
    path: "stats",
    component: AdminStatsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      roles: ["admin_root"],
      description: "Server stats",
    },
  },
  {
    path: "mail",
    component: AdminMailComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      roles: ["admin_root"],
      description: "Send mail tool",
    },
  },
  {
    path: "logins",
    component: AdminLoginsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    data: {
      roles: ["admin_root"],
      description: "User logins",
    },
  },
];

@NgModule({
  declarations: [
    AdminUsersComponent,
    AdminGroupsComponent,
    AdminSessionsComponent,
    AdminStatsComponent,
    AdminMailComponent,
    AdminLoginsComponent,
  ],
  exports: [
    AdminUsersComponent,
    AdminGroupsComponent,
    AdminSessionsComponent,
    AdminStatsComponent,
    AdminMailComponent,
    AdminLoginsComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
