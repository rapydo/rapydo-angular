import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'error404',
  templateUrl: `app.error.404.html`
})
export class Error404Component {

	constructor(private _location: Location) { }

	goBack() {
		this._location.back();
	}

}
