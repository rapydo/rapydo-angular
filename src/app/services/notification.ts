import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

// deprecated since 0.7.3
export interface ApiResponse {
  errors: string[];
}

@Injectable()
export class NotificationService {

  readonly CRITICAL = 1;
  readonly ERROR = 2;
  readonly WARNING = 3;
  readonly INFO = 4;

  constructor(private toastr: ToastrService) {}

  // deprecated since 0.7.3
  public extractErrors = function(response: ApiResponse, type: number) {

    if (response) {
      // now it always is a single error
      return this.showAll([response], type);

    }

  }
  public showAll = function(messages: string[], type: number) {
    // deprecated since 0.7.3
    console.warn("Deprecated use of showAll");
    if (messages)
    // remove loop when multiple errors will be disabled from backend
    for (let i=0; i<messages.length; i++) {
        let message = messages[i];

        if (typeof(message) == 'object') {
          message = this.extractMessage(message);
        }

        if (type == this.CRITICAL) this.showCritical(message);
        else if (type == this.ERROR) this.showError(message);
        else if (type == this.WARNING) this.showWarning(message);
        else if (type == this.INFO) this.showInfo(message);
        else console.error("Unknown message type. NotificationService is unable to satisfy this request");
    }
  }

  public extractMessage(message: object) {
    /*
    # Condition 'typeof(message) == 'string'' is always false
    # because the parameter 'message' is annotated as object type

    if (typeof(message) == 'string') {
      return message;
    }
    */

    if (message['message']) {
      return message['message'];
    }

    return message;
  }

  private isDict(dict) {
    return typeof dict === "object" && !Array.isArray(dict);
  }

  public showCritical = function(msg: any, title: string = '') {

    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        if (title == '') title = k;
        msg = msg[k];
        break;
      }
    }

    this.toastr.error(
      msg, title,
      {
        timeOut: 0
      }
    );
  }

  public showError = function(msg: any, title: string = '') {

    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        if (title == '') title = k;
        msg = msg[k];
        break;
      }
    }

    this.toastr.error(
      msg, title,
      {
        timeOut: 15000
      }
    );
  }

  public showWarning = function(msg: any, title: string = '') {

    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        if (title == '') title = k;
        msg = msg[k];
        break;
      }
    }

    this.toastr.warning(
      msg, title,
      {
        timeOut: 10000
      }
    );
  }

  public showSuccess = function(msg: any, title: string = '') {

    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        if (title == '') title = k;
        msg = msg[k];
        break;
      }
    }

    this.toastr.success(
      msg, title,
      {
        timeOut: 10000
      }
    );
  }
  public showInfo = function(msg: any, title: string = '') {

    if (this.isDict(msg)) {
      // only return the first key... to be extended to every key??
      for (let k in msg) {
        if (title == '') title = k;
        msg = msg[k];
        break;
      }
    }

    this.toastr.info(
      msg, title,
      {
        timeOut: 10000
      }
    );
  }

}
