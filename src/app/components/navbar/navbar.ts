import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.html',
})
export class NavbarComponent {

	@Input() user: any;

	private logoutConfirmationTitle:string = "Logout request";
	private logoutConfirmationMessage:string = "Do you really want to close this session?";	

	constructor(private router: Router, private api: ApiService, private auth: AuthService) { }

	do_logout() {
		this.auth.logout().subscribe(
			response =>  {
				this.router.navigate(['']);
			}
		);
	}

}
