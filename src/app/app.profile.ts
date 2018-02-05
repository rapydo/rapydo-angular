
import { Component } from '@angular/core';
import { Injectable, Inject } from '@angular/core';

import { ApiService } from './api.service';

@Component({
  selector: 'profile',
  providers: [ApiService],
  template: `
  	<div *ngIf="_rootScope.profile; else notLogged">You are logged as {{_rootScope.profile.email}}</div>
  	<ng-template #notLogged>
  		You are not logged in
  	</ng-template>
  `
})
export class ProfileComponent { 

	constructor(
		api: ApiService,
		@Inject('$rootScope') private _rootScope: any) {

			console.log(api.get())

	}

}
