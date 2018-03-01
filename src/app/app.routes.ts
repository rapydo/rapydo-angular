

import { Routes } from '@angular/router';

import { AuthGuard } from './app.auth.guard';

import { LoginComponent } from './login.component';
import { ProfileComponent } from './app.profile';
import { ChangePasswordComponent } from './app.profile.changepassword';
import { SessionsComponent } from './app.profile.sessions';
import { TestComponent } from './app.test';

export const appRoutes: Routes = [
  {
    path: 'new/login', component: LoginComponent
  },
  {
    path: 'new/test',
    component: TestComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'admin_root'
    }
  },
  {
    path: 'new/profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new/profile/changepassword',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new/profile/sessions',
    component: SessionsComponent,
    canActivate: [AuthGuard]
  }
];
