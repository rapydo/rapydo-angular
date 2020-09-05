import { Component } from "@angular/core";

import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";

interface Stats {
  boot_time: number;
  cpu: CPUStats;
  disk: DiskStats;
  io: IOStats;
  network_latency: NetworkStats;
  procs: ProcsStats;
  ram: RAMStats;
  swap: SwapStats;
}

interface CPUStats {
  count: number;
  load: number;
  user: number;
  idle: number;
  wait: number;
  system: number;
  stolen: number;
}

interface DiskStats {
  free_disk_space: number;
  total_disk_space: number;
  used_disk_space: number;
  occupacy: number;
}

interface IOStats {
  blocks_received: number;
  blocks_sent: number;
}

interface NetworkStats {
  min: number;
  max: number;
  avg: number;
}

interface ProcsStats {
  waiting_for_run: number;
  uninterruptible_sleep: number;
}

interface RAMStats {
  active: number;
  buffer: number;
  cache: number;
  free: number;
  inactive: number;
  total: number;
  used: number;
}

interface SwapStats {
  free: number;
  from_disk: number;
  to_disk: number;
  total: number;
  used: number;
}

@Component({
  // selector: "admin_stats",
  templateUrl: "admin_stats.html",
})
export class AdminStatsComponent {
  public stats: Stats;

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
    this.api.get<Stats>("admin/stats").subscribe(
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
