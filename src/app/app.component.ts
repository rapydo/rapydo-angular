import { Component, OnInit } from '@angular/core';
import { VERSION as NG_VERSION } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './app.auth.service';
import { NavbarComponent } from './app.navbar';
import { version as NGJS_VERSION } from 'angular';

@Component({
  selector: 'rapydo',
  providers: [AuthService, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	private user: any;

	versions = {
		angularjs: NGJS_VERSION.full,
		angular: NG_VERSION.full
	}

	constructor(
			private auth: AuthService,
			private titleService: Title,
			private ref: ChangeDetectorRef) {

		var t = process.env.projectTitle;
		t = t.replace(/^'/, "");
		t = t.replace(/'$/, "");
		titleService.setTitle(t);

		this.user = auth.getUser();
		auth.userChanged.subscribe(user => this.changeLogged(user));
	}


	changeLogged(user: any) {

		if (user == this.auth.LOGGED_OUT) {
			console.log("Received <" + user  + "> event");
			this.user = undefined;
			this.ref.detectChanges();

		} else if (user == this.auth.LOGGED_IN) {
			console.log("Received <" + user  + "> event");
			this.user = this.auth.getUser();
			/*this.ref.detectChanges();*/

		} else {
			console.log("Received unknown user event: <" + user  + ">");
		}

	}

}
