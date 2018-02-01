(function() {
  'use strict';

angular.module('web').controller('QueueController', QueueController);
// angular.module('web').controller('QueueDialogController', QueueDialogController);

function QueueController($scope, $log, api, noty, FormDialogService)
{
	var self = this;


	self.loadQueue = function() {
		self.loading = true
		self.queue = []
		api.apiCall('queue', 'GET').then(
			function(out_data) {
				self.loading = false
				self.queue = out_data.data;
				noty.extractErrors(out_data, noty.WARNING);
			},
			function(out_data) {
				noty.extractErrors(out_data, noty.ERROR);
			}
		);
	}

	self.loadQueue();

	self.pauseTask = function(task_id, ev) {

		var text = "Are you really sure you want to pause this task?";
		// var subtext = "This operation cannot be undone.";
		var subtext = "";
		FormDialogService.showConfirmDialog(text, subtext).then(
			function(answer) {
				api.apiCall('queue', 'PUT', {}, task_id).then(
					function(out_data) {
			    		$log.debug("task paused");
			    		noty.showWarning("Task successfully paused.");
						self.loadQueue();
			        	noty.extractErrors(out_data, noty.WARNING);
		    		},
		    		function(out_data) {
			        	noty.extractErrors(out_data, noty.ERROR);
		    		}
		    	)
			},
			function() {
			}
		);
	}


	self.terminateTask = function(task_id, ev) {

		var text = "Are you really sure you want to terminate this task?";
		// var subtext = "This operation cannot be undone.";
		var subtext = "";
		FormDialogService.showConfirmDialog(text, subtext).then(
			function(answer) {
				api.apiCall('queue', 'DELETE', {}, task_id).then(
					function(out_data) {
			    		$log.debug("task terminated");
			    		noty.showWarning("Task successfully terminated.");
						self.loadQueue();
			        	noty.extractErrors(out_data, noty.WARNING);
		    		},
		    		function(out_data) {
			        	noty.extractErrors(out_data, noty.ERROR);
		    		}
		    	)
			},
			function() {
			}
		);
	}
}

})();
