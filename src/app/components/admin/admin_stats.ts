import { Component } from "@angular/core";

import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";
import { AdminStats } from "@rapydo/types";

@Component({
  // selector: "admin_stats",
  templateUrl: "admin_stats.html",
})
export class AdminStatsComponent {
  public stats: AdminStats;

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService
  ) {
    this.retrieve_stats();
  }

  public retrieve_stats(): void {
    this.spinner.show();
    this.api
      .get<AdminStats>(
        "admin/stats",
        "",
        {},
        { validationSchema: "AdminStats" }
      )
      .subscribe(
        (response) => {
          this.stats = response;
          this.spinner.hide();
        },
        (error) => {
          this.notify.showError(error);
          this.spinner.hide();
        }
      );
  }
}
