import { Injectable } from '@angular/core';

@Injectable()
export class TemplatingService {

	constructor() {}

	public getDeleteConfirmation(name) {
		return {
			title: "Confirmation required",
			message:`<div class='card text-center'>
					<div class='card-body'>
					<h4 class='card-title'>Are you really sure you want to delete this ` + name +`?</h4>
					<p class='card-text'>This operation cannot be undone.</p>
					</div>
					</div>`
				}
	}

}
