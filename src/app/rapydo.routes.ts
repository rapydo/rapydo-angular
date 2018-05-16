

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
    path: 'app/login', component: LoginComponent
  },
/*  {
    path: 'app/test',
    component: MyComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'admin_root'
    }
  },*/
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
  }

];
