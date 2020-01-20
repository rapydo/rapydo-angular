import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@rapydo/shared.module';
import { AuthGuard } from '@rapydo/app.auth.guard';

import { AdminUsersComponent } from '@rapydo/components/admin/admin_users';

const routes: Routes = [
  {
    path: 'users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { roles: ['admin_root', 'local_admin'] }
  }
];

@NgModule({
    declarations: [ AdminUsersComponent ],
    exports: [ AdminUsersComponent ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class AdminModule { }
