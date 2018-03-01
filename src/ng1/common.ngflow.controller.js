(function() {
  'use strict';

angular.module('web').config(FlowFactory);
angular.module('web').controller('NgFlowController', NgFlowController);

function FlowFactory(flowFactoryProvider) {
    flowFactoryProvider.factory = function(opts) {
        var Flow = require("ng-flow/dist/ng-flow-standalone.min.js");
        return new Flow(opts);
    }
};
FlowFactory.$inject = ["flowFactoryProvider"];

function NgFlowController($rootScope, $log, noty)
{
   
    $rootScope.showNgUploadErrors = function( $file, $message, $flow ) {

    	var errorMessage = ""
    	try {
    		var dataObj = JSON.parse($message);

	    	if (dataObj.Response)
			if (dataObj.Response.errors)
			for (var i=0; i<dataObj.Response.errors.length; i++) {
			    errorMessage = dataObj.Response.errors[i];
			    break;

			}
    	} catch(err) {
    		errorMessage = "generic error"
    	}

    	noty.showError($file.name + ": " + errorMessage)
    	$file.error_message = errorMessage;

    }
};

NgFlowController.$inject = ["$rootScope", "$log", "noty"];

})();
