import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from './api';

import { environment } from '@rapydo/../environments/environment';

//const Noty = require('noty');
import Noty from 'noty';

@Injectable()
export class NotificationService {

  readonly CRITICAL = 1;
  readonly ERROR = 2;
  readonly WARNING = 3;
  readonly INFO = 4;

  private enable_toastr:boolean = environment.enableToastr == "true";

  constructor(private toastr: ToastrService) {console.log(environment.enableToastr);}

  public extractErrors = function(response: ApiResponse, type: number) {
    if (response && response.errors)
      return this.showAll(response.errors, type);
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
    if (typeof(message) == 'string') {
      return message;
    }

    if (message['message']) {
      return message['message'];
    }

    return message;
  }

  public showCritical = function(msg: string, title: string = '') {

    if (this.enable_toastr) {
      this.toastr.error(
        msg, title,
        {
          timeOut: 0
        }
      );
    } else {
      new Noty({
          text        : msg,
          type        : "error",
          modal       : true,
          timeout     : false,
          force       : true,
          killer      : true,
          layout      : 'bottomRight',
          theme       : 'metroui'
      }).show();
    }
  }

  public showError = function(msg: string, title: string = '') {

    if (this.enable_toastr) {
      this.toastr.error(
        msg, title,
        {
          timeOut: 15000
        }
      );
    } else {
      new Noty({
          text        : msg,
          type        : "error",
          modal       : false,
          timeout     : 10000,
          layout      : 'bottomRight',
          theme       : 'relax'
      }).show();
    }
  }

  public showWarning = function(msg: string, title: string = '') {

    if (this.enable_toastr) {
      this.toastr.warning(
        msg, title,
        {
          timeOut: 10000
        }
      );
    } else {
      new Noty({
          text        : msg,
          type        : "warning",
          modal       : false,
          timeout     : 5000,
          layout      : 'bottomRight',
          theme       : 'relax'
      }).show();
    }
  }

  public showSuccess = function(msg: string, title: string = '') {
    if (this.enable_toastr) {
      this.toastr.success(
        msg, title,
        {
          timeOut: 10000
        }
      );
    } else {
      new Noty({
          text        : msg,
          type        : "success",
          modal       : false,
          timeout     : 5000,
          layout      : 'bottomRight',
          theme       : 'relax'
      }).show();
    }
  }
  public showInfo = function(msg: string, title: string = '') {

    if (this.enable_toastr) {
      this.toastr.info(
        msg, title,
        {
          timeOut: 10000
        }
      );
    } else {
      new Noty({
          text        : msg,
          type        : "information",
          modal       : false,
          timeout     : 5000,
          layout      : 'bottomRight',
          theme       : 'relax'
      }).show();
    }
  }

}
