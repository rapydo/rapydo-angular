import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '404', component: Error404Component
  },
  {
  	path: '**',
  	redirectTo: '/404',
  	pathMatch: 'full'
  }

];

@NgModule({
  imports: [
  	CommonModule,
    RouterModule.forChild(
      routes,
      {
        enableTracing: false,
        onSameUrlNavigation: 'reload'
       } // <-- debugging purposes only
    )
  ],
  declarations: [
  	Error404Component
  ],

  exports: [
  	RouterModule,
    Error404Component
  ],
  providers: [
  ],
})
export class PageNotFoundModule {
} 
