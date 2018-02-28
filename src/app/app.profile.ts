
import { Component, OnInit } from '@angular/core';
import { Injectable, Injector } from '@angular/core';

import { ApiService } from './api.service';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'profile',
  providers: [ApiService, AuthService],
  template: `
  	<div *ngIf="user; else notLogged">
      You are logged as {{user.email}}
     </div>

  	<ng-template #notLogged>
  		You are not logged in
  	</ng-template>


  `
})
export class ProfileComponent implements OnInit { 

  private _rootScope: any
  private user: any

	constructor(api: ApiService, private injector: Injector, auth: AuthService) {

			//console.log(api.get());
      this.user = auth.getUser();

	}

  ngOnInit() {

    this._rootScope = this.injector.get('$rootScope');
  }

}
