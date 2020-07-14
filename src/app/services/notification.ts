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

  public showCritical = function (msg: any, title: string = "") {
    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        if (title === "") {
          title = k;
        }
        msg = msg[k];
        break;
      }
    }

    this.toastr.error(msg, title, {
      timeOut: 0,
    });
  };

  public showError = function (msg: any, title: string = "") {
    if (msg.error) {
      msg = msg.error;
    }

    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        if (title === "") {
          title = k;
        }
        msg = msg[k];
        break;
      }
    }

    this.toastr.error(msg, title, {
      timeOut: 15000,
    });
  };

  public showWarning = function (msg: any, title: string = "") {
    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        if (title === "") {
          title = k;
        }
        msg = msg[k];
        break;
      }
    }

    this.toastr.warning(msg, title, {
      timeOut: 10000,
    });
  };

  public showSuccess = function (msg: any, title: string = "") {
    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        // The body of a for-in should be wrapped in an if statement
        // to filter unwanted properties from the prototype.
        if (Object.prototype.hasOwnProperty.call(msg, k)) {
          if (title === "") {
            title = k;
          }
          msg = msg[k];
          break;
        }
      }
    }

    this.toastr.success(msg, title, {
      timeOut: 10000,
    });
  };
  public showInfo = function (msg: any, title: string = "") {
    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        if (title === "") {
          title = k;
        }
        msg = msg[k];
        break;
      }
    }

    this.toastr.info(msg, title, {
      timeOut: 10000,
    });
  };
}
