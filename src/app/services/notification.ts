import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class NotificationService {
  readonly CRITICAL = 1;
  readonly ERROR = 2;
  readonly WARNING = 3;
  readonly INFO = 4;

  constructor(private toastr: ToastrService) {}

  private isDict(dict) {
    return typeof dict === "object" && !Array.isArray(dict);
  }

  public showCritical = function (msg: any, title: string = ""): void {
    if (this.isDict(msg)) {
      for (let k in msg) {
        this.showCritical(msg[k], title || k);
      }
    } else {
      this.toastr.error(msg, title, {
        timeOut: 0,
      });
    }
  };

  public showError = function (msg: any, title: string = ""): void {
    if (msg.error) {
      msg = msg.error;
    } else if (msg.message) {
      msg = msg.message;
    }

    if (this.isDict(msg)) {
      for (let k in msg) {
        this.showError(msg[k], title || k);
      }
    } else {
      this.toastr.error(msg, title, {
        timeOut: 15000,
      });
    }
  };

  public showWarning = function (msg: any, title: string = ""): void {
    if (this.isDict(msg)) {
      for (let k in msg) {
        this.showWarning(msg[k], title || k);
      }
    } else {
      this.toastr.warning(msg, title, {
        timeOut: 10000,
      });
    }
  };

  public showSuccess = function (msg: any, title: string = ""): void {
    if (this.isDict(msg)) {
      for (let k in msg) {
        this.showSuccess(msg[k], title || k);
      }
    } else {
      this.toastr.success(msg, title, {
        timeOut: 10000,
      });
    }
  };

  public showInfo = function (msg: any, title: string = ""): void {
    if (this.isDict(msg)) {
      for (let k in msg) {
        this.showInfo(msg[k], title || k);
      }
    } else {
      this.toastr.info(msg, title, {
        timeOut: 10000,
      });
    }
  };
}
