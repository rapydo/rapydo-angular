import { Injectable } from '@angular/core';
import { ApiResponse } from './api';

const Noty = require('noty');
@Injectable()
export class NotificationService {

    readonly CRITICAL = 1;
    readonly ERROR = 2;
    readonly WARNING = 3;
    readonly INFO = 4;

    constructor() {}

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
            else console.log('Unknown message type. NotificationService is unable to satisfy this request');
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

    public showCritical = function(msg: string) {

        new Noty({
            text        : msg,
            type        : 'error',
            dismissQueue: true,
            modal       : true,
            maxVisible  : 1,
            timeout     : false,
            force       : true,
            killer      : true,
            layout      : 'bottomRight',
            theme       : 'metroui'
        }).show();
    }

    public showError = function(msg: string) {

        new Noty({
            text        : msg,
            type        : 'error',
            dismissQueue: true,
            modal       : false,
            maxVisible  : 5,
            timeout     : 10000,
            layout      : 'bottomRight',
            theme       : 'relax'
        }).show();
    }

    public showWarning = function(msg: string) {

        new Noty({
            text        : msg,
            type        : 'warning',
            dismissQueue: true,
            modal       : false,
            maxVisible  : 3,
            timeout     : 5000,
            layout      : 'bottomRight',
            theme       : 'relax'
        }).show();
    }

    public showSuccess = function(msg: string) {

        new Noty({
            text        : msg,
            type        : 'success',
            dismissQueue: true,
            modal       : false,
            maxVisible  : 3,
            timeout     : 5000,
            layout      : 'bottomRight',
            theme       : 'relax'
        }).show();
    }
    public showInfo = function(msg: string) {

        new Noty({
            text        : msg,
            type        : 'information',
            dismissQueue: true,
            modal       : false,
            maxVisible  : 3,
            timeout     : 5000,
            layout      : 'bottomRight',
            theme       : 'relax'
        }).show();
    }

}
