
import { Component, OnInit } from '@angular/core';
import { Injectable, Inject, Injector } from '@angular/core';

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
export class ProfileComponent implements OnInit { 

  private _rootScope: any

	constructor(api: ApiService, private injector: Injector) {

			console.log(api.get())

	}

  ngOnInit() {

    this._rootScope = this.injector.get('$rootScope');
  }

}
