import { Component } from '@angular/core';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'navbar',
  providers: [AuthService],
  templateUrl: './app.navbar.html',
})
export class NavbarComponent {

	private user: any

	constructor(private auth: AuthService) {
		auth.userChanged.subscribe(user => {this.changeLogged(user)});
	}

	private changeLogged(user: any): void {
		console.log(user);
		this.user = user
	}

}
