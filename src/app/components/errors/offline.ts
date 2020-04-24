import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from '@rapydo/services/api';

@Component({
  template: ``
})
export class OfflineComponent {

  constructor(private api: ApiService, private router: Router) {
  	if (this.api.is_online()) {
	  	this.router.navigate(['']);
  	}
  }

}
