import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@rapydo/shared.module';
import { AuthGuard } from '@rapydo/app.auth.guard';

import { AdminUsersComponent } from '@rapydo/components/admin/admin_users';
import { AdminGroupsComponent } from '@rapydo/components/admin/admin_groups';
import { AdminSessionsComponent } from '@rapydo/components/admin/admin_sessions';

const routes: Routes = [
  {
    path: 'users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { roles: ['admin_root', 'local_admin'] }
  },
  {
    path: 'groups',
    component: AdminGroupsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { roles: ['admin_root', 'local_admin'] }
  },
  {
    path: 'sessions',
    component: AdminSessionsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { roles: ['admin_root'] }
  }
];

@NgModule({
    declarations: [ AdminUsersComponent, AdminGroupsComponent, AdminSessionsComponent ],
    exports: [ AdminUsersComponent, AdminGroupsComponent, AdminSessionsComponent ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class AdminModule { }
