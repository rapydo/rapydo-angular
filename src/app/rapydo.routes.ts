import { Routes } from '@angular/router';

import { AuthGuard } from './app.auth.guard';

import { LoginComponent } from './components/login/login';
import { ResetPasswordComponent } from './components/login/reset';

import { Error404Component } from './components/errors/404';
import { OfflineComponent } from './components/errors/offline';

import { ProfileComponent } from './components/profile/profile';
import { ChangePasswordComponent } from './components/profile/changepassword';
import { SessionsComponent } from './components/profile/sessions';

import { AdminUsersComponent } from './components/admin_users/admin_users';

export const appRoutes: Routes = [
  {
    path: '404', component: Error404Component
  },
  {
    path: 'offline', component: OfflineComponent
  },
  {
    path: 'app/login', component: LoginComponent
  },
  {
    path: 'public/reset', component: ResetPasswordComponent
  },
  {
    path: 'public/reset/:token', component: ResetPasswordComponent
  },
  {
    path: 'app/profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'app/profile/changepassword',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'app/profile/sessions',
    component: SessionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'app/admin/users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'admin_root'
    }
  }

];
