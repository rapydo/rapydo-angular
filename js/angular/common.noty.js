(function() {
  'use strict';

angular.module('web').service('noty', NotyService);

/*
import Noty from 'noty';
const Noty = require('noty');
*/

function NotyService() {

	var self = this;

	self.CRITICAL = 1;
	self.ERROR = 2;
	self.WARNING = 3;
	self.INFO = 4;

	// [label1: msg1, label2: msg2]

	self.extractErrors = function(response, type) {
		if (response)
			if (response.errors)
				return self.showAll(response.errors, type);
	}
	self.showAll = function(messages, type) {
		if (messages)
		for (var i=0; i<messages.length; i++) {
		    var message = messages[i];
		    // var label = Object.keys(message).pop();
		    // var text = message[label];

		    // var m = label+": "+text;

		    if (type == self.CRITICAL) self.showCritical(message);
		    else if (type == self.ERROR) self.showError(message);
		    else if (type == self.WARNING) self.showWarning(message);
		    else if (type == self.INFO) self.showInfo(message);
		    else $log.warn("Unknown message type. NotyService is unable to satisfy this request");
		}
	}

	self.showCritical = function(msg) {

	    new Noty({
	        text        : msg,
	        type        : "error",
	        dismissQueue: true,
	        modal       : true,
	        maxVisible  : 1,
	        timeout     : 0,
	        force		: true,
	        killer      : true,
	        layout      : 'bottom',
	        theme       : 'mint'
	    }).show();
	}

	self.showError = function(msg) {

	    new Noty({
	        text        : msg,
	        type        : "error",
	        dismissQueue: true,
	        modal       : false,
	        maxVisible  : 5,
	        timeout     : 10000,
	        layout      : 'bottom',
	        theme       : 'relax'
	    }).show();
	}

	self.showWarning = function(msg) {

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

	self.showSuccess = function(msg) {

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
	self.showInfo = function(msg) {

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

})();
