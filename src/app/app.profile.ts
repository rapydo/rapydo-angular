
import { Component } from '@angular/core';
import { Injectable, Inject } from '@angular/core';

@Component({
  selector: 'profile',
  template: `
  	<div *ngIf="_rootScope.profile; else notLogged">You are logged as {{_rootScope.profile.email}}</div>
  	<ng-template #notLogged>
  		You are not logged in
  	</ng-template>
  `
})
@Injectable()
export class ProfileComponent { 

	constructor(@Inject('$rootScope') private _rootScope: any) {

	}

}
