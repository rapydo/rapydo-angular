import { Component, OnInit } from "@angular/core";

import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";
import { AdminStats } from "@rapydo/types";

@Component({
  templateUrl: "admin_stats.html",
})
export class AdminStatsComponent implements OnInit {
  public stats: AdminStats;
  public current_date = new Date();

  public refresh_interval: number = 60000;
  private refresh_timer: ReturnType<typeof setInterval>;

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.retrieve_stats();
    // Auto refresh every minute
    this.refresh_timer = setInterval(() => {
      this.retrieve_stats();
    }, this.refresh_interval);
  }
  ngOnDestroy() {
    if (this.refresh_timer) {
      clearInterval(this.refresh_timer);
    }
  }
  reset_timer(interval: number): void {
    if (this.refresh_timer) {
      clearInterval(this.refresh_timer);
    }
    this.refresh_interval = interval * 1000;
    this.refresh_timer = setInterval(() => {
      this.retrieve_stats();
    }, this.refresh_interval);
  }

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
