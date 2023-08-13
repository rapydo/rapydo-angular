import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
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

  private refresh_timer: ReturnType<typeof setInterval>;

  public showForm: boolean = true;
  public form = new FormGroup({});
  public fields: FormlyFieldConfig[] = [];
  public model: any = {
    refresh_interval: 0,
  };

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService,
  ) {}

  ngOnInit() {
    this.retrieve_stats();
    if (this.model["refresh_interval"] > 0) {
      this.refresh_timer = setInterval(() => {
        this.retrieve_stats();
      }, this.model["refresh_interval"] * 1000);
    }

    this.fields = [
      {
        key: "refresh_interval",
        type: "input",
        defaultValue: "",
        props: {
          type: "number",
          min: 0,
          max: 3600,
          label: "",
          change: (field: FormlyFieldConfig, event?: any) => {
            this.reset_timer();
          },
          addonLeft: {
            class: "fas fa-rotate clickable",
            onClick: () => {
              this.retrieve_stats();
            },
          },
          addonRight: {
            text: "seconds",
          },
          required: true,
        },
      },
    ];
  }
  ngOnDestroy() {
    if (this.refresh_timer) {
      clearInterval(this.refresh_timer);
    }
  }
  reset_timer(): void {
    if (this.refresh_timer) {
      clearInterval(this.refresh_timer);
    }
    if (this.model["refresh_interval"] > 0) {
      this.refresh_timer = setInterval(() => {
        this.retrieve_stats();
      }, this.model["refresh_interval"] * 1000);
    }
  }

  public retrieve_stats(): void {
    this.spinner.show();
    this.api
      .get<AdminStats>(
        "/api/admin/stats",
        {},
        { validationSchema: "AdminStats" },
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
        },
      );
  }
}
