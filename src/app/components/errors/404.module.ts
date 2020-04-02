import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { Error404Component } from '@rapydo/components/errors/404';

const routes: Routes = [
  {
    path: 'app/404', component: Error404Component
  },
  {
  	path: '**',
  	redirectTo: 'app/404',
  	pathMatch: 'full'
  }

];

@NgModule({
  imports: [
  	CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
  	Error404Component
  ],

  exports: [
  	RouterModule,
    Error404Component
  ],
  providers: [],
})
export class PageNotFoundModule {
} 
