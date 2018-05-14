

import { Routes } from '@angular/router';

import { AuthGuard } from './app.auth.guard';

import { LoginComponent } from './components/login/login';
import { ProfileComponent } from './components/profile/profile';
import { HomeComponent } from '/app/frontend/app/app.home';
import { Error404Component } from './components/errors/404';
import { OfflineComponent } from './components/errors/offline';
import { ChangePasswordComponent } from './components/profile/changepassword';
import { SessionsComponent } from './components/profile/sessions';

export const appRoutes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: '404', component: Error404Component
  },
  {
    path: 'offline', component: OfflineComponent
  },
  {
    path: 'new/login', component: LoginComponent
  },
/*  {
    path: 'new/test',
    component: MyComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'admin_root'
    }
  },*/
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
