import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './services/auth';
import { ApiService} from './services/api';
import { NavbarComponent } from './components/navbar/navbar';
import { ProjectOptions } from '/app/frontend/app/custom.project.options';

@Component({
  selector: 'rapydo',
  providers: [AuthService, ApiService, NavbarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  @ViewChild('cookieLaw', { static: false }) private cookieLawEl: any;
  public loading: boolean = false;
  private user: any;

  public cookieLawText:string;
  public cookieLawButton:string;


  constructor(
      public api: ApiService,
      private auth: AuthService,
      private titleService: Title,
      private ref: ChangeDetectorRef,
      private customization: ProjectOptions
      ) {

    this.loading = true;

    this.cookieLawText = this.customization.get_option('cookie_law_text');
    this.cookieLawButton = this.customization.get_option('cookie_law_button');

  }

  public ngOnInit(): void {
    let t = process.env.projectTitle;
    t = t.replace(/^'/, "");
    t = t.replace(/'$/, "");
    this.titleService.setTitle(t);
    this.auth.userChanged.subscribe(
      user => this.changeLogged(user)
    );
    this.auth.isAuthenticated().subscribe(
      is_auth => {
        if (is_auth) {
          this.user = this.auth.getUser();
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

  public dismissCookieLaw(): void {
    this.cookieLawEl.dismiss();
  }

}
