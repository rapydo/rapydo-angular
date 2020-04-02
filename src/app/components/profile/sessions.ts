import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { NotificationService} from '../../services/notification';

import { environment } from '@rapydo/../environments/environment';

@Component({
  selector: 'sessions',
  templateUrl: 'sessions.html'
})
export class SessionsComponent implements OnInit { 

  private confirmationTitle = "Confirmation required";
  private confirmationMessage = `
    <div class='card text-center'>
    <div class='card-body'>
    <h4 class='card-title'>Are you really sure you want to invalidate this token?</h4>
    <p class='card-text'>This token will no longer available. This operation cannot be undone.</p>
    </div>
    </div>
    `;

  public tokens: any
  public currentToken: string;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService
  ) { }

  public ngOnInit(): void {

    this.loadTokens();
    this.currentToken = this.auth.getToken();

  }

  loadTokens() {
    this.api.get('tokens', "", [], {"base": "auth"}).subscribe(
      response => {
        if (response) {
          if (environment.WRAP_RESPONSE == '1') response = response.data;
          this.tokens = response
        }
      },
      error => {
        if (environment.WRAP_RESPONSE == '1') {
          this.notify.showError(error.Response.errors);
        } else {
          this.notify.showError(error);
        }
      }
   );
  }

  revokeToken(id) {

    this.api.delete('tokens', id, {"base": "auth"}).subscribe(
      response => {
        this.notify.showSuccess("Token successfully revoked");
        this.loadTokens();
      }, error => {
        if (environment.WRAP_RESPONSE == '1') {
          this.notify.showError(error.Response.errors);
        } else {
          this.notify.showError(error);
        }
      }
    );
  }

  copied(event) {
    if (event['isSuccess']) {
      this.notify.showSuccess("Token successfully copied");
    }
  }

}
