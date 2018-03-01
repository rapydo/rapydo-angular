import { Component, Input } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './app.navbar.html',
})
export class NavbarComponent {

	@Input() user: any;

	constructor() {
	}

}
