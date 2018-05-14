
import { Component } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

import { ApiService } from './services/api';
import { AuthService } from './services/auth';
import { NotificationService} from './services/notification';

@Component({
  selector: 'sessions',
  providers: [ApiService, AuthService, NotificationService],
  templateUrl: './sessions.html'
})
export class SessionsComponent { 

	private confirmationTitle = "Confirmation required";
	private confirmationMessage = `
		<div class='card text-center'>
		<div class='card-body'>
		<h4 class='card-title'>Are you really sure you want to invalidate this token?</h4>
		<p class='card-text'>This token will no longer available. This operation cannot be undone.</p>
		</div>
		</div>
		`;

    private tokens: any
    private currentToken: string;

	constructor(private api: ApiService, private auth: AuthService, private notify: NotificationService) {

      // this.user = auth.getUser();
      	this.loadTokens();
      	this.currentToken = this.auth.getToken();


	}

	loadTokens() {
		this.api.get('tokens', "", [], {"base": "auth"}).subscribe(
      		response => {
      			this.tokens = response.data
      		}
       );

	}

	revokeToken(id) {

		this.api.delete('tokens', id, {"base": "auth"}).subscribe(
			response => {
				this.notify.showSuccess("Token successfully revoked");
				this.loadTokens();
			}, error => {
				this.notify.extractErrors(error, this.notify.ERROR);
			}
		);
	}

	cancelRequest() {
		/*console.log("Request cancelled");*/
	}

}
