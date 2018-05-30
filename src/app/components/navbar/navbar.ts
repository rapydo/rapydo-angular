import { Component, Input } from '@angular/core';
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

	constructor(private api: ApiService, private auth: AuthService) { }

	do_logout() {
		this.auth.logout().subscribe(
			response =>  {
				console.log("bye bye")
			}
		);
	}

}
