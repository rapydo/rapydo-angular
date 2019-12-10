import { Component, OnInit, ViewChild } from '@angular/core';
// import { ChangeDetectorRef } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import { environment } from '@rapydo/../environments/environment';

import { AuthService } from '@rapydo/services/auth';
import { ApiService} from '@rapydo/services/api';
import { NavbarComponent } from '@rapydo/components/navbar/navbar';
import { NotificationService} from '@rapydo/services/notification';
import { ProjectOptions } from '@app/custom.project.options';

@Component({
  selector: 'rapydo',
  providers: [AuthService, ApiService, NavbarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  @ViewChild('cookieLaw', { static: false }) private cookieLawEl: any;
  // public loading: boolean = false;
  // public user: any;

  public cookieLawText:string;
  public cookieLawButton:string;


  constructor(
      public api: ApiService,
      private auth: AuthService,
      private titleService: Title,
      // private ref: ChangeDetectorRef,
      private customization: ProjectOptions,
      private notify: NotificationService
      ) {

    //this.loading = true;

    this.cookieLawText = this.customization.get_option('cookie_law_text');
    this.cookieLawButton = this.customization.get_option('cookie_law_button');

  }

  public ngOnInit(): void {
    let t = environment.projectTitle;
    t = t.replace(/^'/, "");
    t = t.replace(/'$/, "");
    this.titleService.setTitle(t);
  }

  public dismissCookieLaw(): void {
    this.cookieLawEl.dismiss();
  }

}
