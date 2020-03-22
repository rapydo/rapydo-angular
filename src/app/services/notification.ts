import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from './api';

@Injectable()
export class NotificationService {

  readonly CRITICAL = 1;
  readonly ERROR = 2;
  readonly WARNING = 3;
  readonly INFO = 4;

  constructor(private toastr: ToastrService) {}

  public extractErrors = function(response: ApiResponse, type: number) {
    if (response && response.errors)
      return this.showAll(response.errors, type);
    else if (response)
      return this.showAll([response], type);
  }
  public showAll = function(messages: string[], type: number) {
    if (messages)
    for (let i=0; i<messages.length; i++) {
        let message = messages[i];

        if (typeof(message) == 'object') {
          message = this.extractMessage(message);
        }

        if (type == this.CRITICAL) this.showCritical(message);
        else if (type == this.ERROR) this.showError(message);
        else if (type == this.WARNING) this.showWarning(message);
        else if (type == this.INFO) this.showInfo(message);
        else console.log("Unknown message type. NotificationService is unable to satisfy this request");
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

  public showCritical = function(msg: string, title: string = '') {

    this.toastr.error(
      msg, title,
      {
        timeOut: 0
      }
    );
  }

  public showError = function(msg: string, title: string = '') {

    this.toastr.error(
      msg, title,
      {
        timeOut: 15000
      }
    );
  }

  public showWarning = function(msg: string, title: string = '') {

    this.toastr.warning(
      msg, title,
      {
        timeOut: 10000
      }
    );
  }

  public showSuccess = function(msg: string, title: string = '') {
    this.toastr.success(
      msg, title,
      {
        timeOut: 10000
      }
    );
  }
  public showInfo = function(msg: string, title: string = '') {

      this.toastr.info(
        msg, title,
        {
          timeOut: 10000
        }
      );
  }

}
