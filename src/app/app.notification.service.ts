import { Injectable } from '@angular/core';

const Noty = require('noty');
@Injectable()
export class NotificationService {

	readonly CRITICAL = 1;
	readonly ERROR = 2;
	readonly WARNING = 3;
	readonly INFO = 4;

	constructor() {}

	public extractErrors = function(response, type) {
		if (response && response.errors)
			return this.showAll(response.errors, type);
	}
	public showAll = function(messages, type) {
		if (messages)
		for (var i=0; i<messages.length; i++) {
		    var message = messages[i];
		    // var label = Object.keys(message).pop();
		    // var text = message[label];

		    // var m = label+": "+text;

		    if (type == this.CRITICAL) this.showCritical(message);
		    else if (type == this.ERROR) this.showError(message);
		    else if (type == this.WARNING) this.showWarning(message);
		    else if (type == this.INFO) this.showInfo(message);
		    else console.log("Unknown message type. NotificationService is unable to satisfy this request");
		}
	}

	public showCritical = function(msg) {

	    new Noty({
	        text        : msg,
	        type        : "error",
	        dismissQueue: true,
	        modal       : true,
	        maxVisible  : 1,
	        timeout     : false,
	        force		: true,
	        killer      : true,
	        layout      : 'bottomRight',
	        theme       : 'metroui'
	    }).show();
	}

	public showError = function(msg) {

	    new Noty({
	        text        : msg,
	        type        : "error",
	        dismissQueue: true,
	        modal       : false,
	        maxVisible  : 5,
	        timeout     : 10000,
	        layout      : 'bottomRight',
	        theme       : 'relax'
	    }).show();
	}

	public showWarning = function(msg) {

	    new Noty({
	        text        : msg,
	        type        : "warning",
	        dismissQueue: true,
	        modal       : false,
	        maxVisible  : 3,
	        timeout     : 5000,
	        layout      : 'bottomRight',
	        theme       : 'relax'
	    }).show();
	}

	public showSuccess = function(msg) {

	    new Noty({
	        text        : msg,
	        type        : "success",
	        dismissQueue: true,
	        modal       : false,
	        maxVisible  : 3,
	        timeout     : 5000,
	        layout      : 'bottomRight',
	        theme       : 'relax'
	    }).show();
	}
	public showInfo = function(msg) {

	    new Noty({
	        text        : msg,
	        type        : "information",
	        dismissQueue: true,
	        modal       : false,
	        maxVisible  : 3,
	        timeout     : 5000,
	        layout      : 'bottomRight',
	        theme       : 'relax'
	    }).show();
	}
	
}
