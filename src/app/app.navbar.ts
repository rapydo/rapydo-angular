import { Component, OnInit } from '@angular/core';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'navbar',
  providers: [AuthService],
  templateUrl: './app.navbar.html',
})
export class NavbarComponent implements OnInit {

	private user: any

	constructor(private auth: AuthService) { }

	ngOnInit() {
		this.auth.userChanged.subscribe(user => this.changeLogged(user));
	}

	changeLogged(i: any) {

		if (i == this.auth.LOGGED_OUT) {
			console.log("utente sloggato");

		} else if (i == this.auth.LOGGED_IN) {
			console.log("utente loggato, recupra il nuovo valore");
		} else {
			console.error("Navbar: unknown emit value: " + i)
		}

		console.log("Logged status changed: " + i);
		this.user = i
	}

}
