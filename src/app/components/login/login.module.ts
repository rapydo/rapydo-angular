import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@rapydo/shared.module';

import { LoginComponent } from '@rapydo/components/login/login';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
];

@NgModule({
    declarations: [
        LoginComponent,
    ],
    exports: [
        LoginComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ]
})
export class LoginModule { }
