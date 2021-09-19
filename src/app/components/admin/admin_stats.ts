import { Component, OnInit } from "@angular/core";
// import { interval, Subscription } from "rxjs";

import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";
import { AdminStats } from "@rapydo/types";

@Component({
  // selector: "admin_stats",
  templateUrl: "admin_stats.html",
})
// implements OnInit
export class AdminStatsComponent {
  public stats: AdminStats;
  public current_date = new Date();

  // private refresh_interval: Subscription;

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService
  ) {
    this.retrieve_stats();
  }

  // ngOnInit() {
  //   // Auto refresh every minute
  //   this.refresh_interval = interval(60000).subscribe(() =>
  //     this.retrieve_stats()
  //   );
  // }
  // ngOnDestroy() {
  //   if (this.refresh_interval) {
  //     this.refresh_interval.unsubscribe();
  //   }
  // }

  public retrieve_stats(): void {
    this.spinner.show();
    this.api
      .get<AdminStats>(
        "/api/admin/stats",
        {},
        { validationSchema: "AdminStats" }
      )
      .subscribe(
        (response) => {
          this.stats = response;
          this.current_date = new Date();
          this.spinner.hide();
        },
        /* istanbul ignore next */ (error) => {
          this.notify.showError(error);
          this.spinner.hide();
        }
      );
  }
}
