import { Component, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
/*import { VERSION as NG_VERSION } from '@angular/core';*/
import { ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './services/auth';
import { ApiService} from './services/api';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'rapydo',
  providers: [AuthService, ApiService, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private loading: boolean = false;
  private user: any;

/*	versions = {
    angular: NG_VERSION.full
  }*/

  constructor(
      private auth: AuthService,
      private api: ApiService,
      private titleService: Title,
      private ref: ChangeDetectorRef) {

    let t = process.env.projectTitle;
    t = t.replace(/^'/, "");
    t = t.replace(/'$/, "");
    titleService.setTitle(t);

    auth.userChanged.subscribe(user => this.changeLogged(user));

    this.loading = true;
    this.auth.isAuthenticated().subscribe(
            is_auth => {
              if (is_auth) {
                  this.user = auth.getUser();
              }
              this.loading = false;
            }
        );
  }


  changeLogged(user: any) {

    if (user == this.auth.LOGGED_OUT) {
      /*console.log("Received <" + user  + "> event");*/
      this.user = undefined;
      this.ref.detectChanges();

    } else if (user == this.auth.LOGGED_IN) {
      /*console.log("Received <" + user  + "> event");*/
      this.user = this.auth.getUser();

    } else {
      console.log("Received unknown user event: <" + user  + ">");
    }

  }

}
