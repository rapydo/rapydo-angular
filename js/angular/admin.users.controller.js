(function() {
  'use strict';

angular.module('web').controller('UsersController', UsersController);
angular.module('web').controller('UserDialogController', UserDialogController);
angular.module('web').controller('AutocompleteUserController', AutocompleteUserController);

function UsersController($scope, $log, DataService, noty, FormDialogService)
{
	var self = this;

	self.loadUsers = function() {
		self.loading = true
		self.users = []
		DataService.getUsers().then(
			function(out_data) {
				self.loading = false
				self.users = out_data.data;
				noty.extractErrors(out_data, noty.WARNING);
			},
			function(out_data) {
				noty.extractErrors(out_data, noty.ERROR);
			}
		);
	}

	self.loadUsers();

	self.updateUser = function(data) {
		FormDialogService.showFormlyDialog(data, UserDialogController).then(
			function(answer) {
				noty.showSuccess("User successfully updated.");
				self.loadUsers();
			}, function() {
			}
		);
	}

	self.addNewUser = function($event) {
		FormDialogService.showFormlyDialog("", UserDialogController).then(
			function(answer) {
				noty.showSuccess("User successfully created.");
				self.loadUsers();
			}, function() {
			}
		);
	}

	self.deleteUser = function(user_id, ev) {
		var text = "Are you really sure you want to delete this user?";
		var subtext = "This operation cannot be undone.";
		FormDialogService.showConfirmDialog(text, subtext).then(
			function(answer) {
				DataService.deleteUser(user_id).then(
					function(out_data) {
			    		$log.debug("User removed");
			    		noty.showWarning("User successfully deleted.");
						self.loadUsers();
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

function AutocompleteUserController($scope, $log, DataService)
{
	var self = this;

    self.newElement = function(element) {
      alert("Sorry! Not implemented " + element);
    }

	self.querySearch = function(type, query) {
		if (type == "group")
			return self.group_querySearch(query);
		if (type == "roles")
			return self.roles_querySearch(query);
		$log.error("Type not found in AutocompleteUserController")
	}

	self.group_querySearch = function( query) {
		if (!query) query = "" 
	 	return DataService.getUserGroups(query).then(
			function(out_data) {
				return out_data.data;
	  		},
			function(out_data) {
				return []
			}
	  	);
	}
	self.roles_querySearch = function( query) {
		if (!query) query = "" 
	 	return DataService.getUserRoles(query).then(
			function(out_data) {
				return out_data.data;
	  		},
			function(out_data) {
				return []
			}
	  	);
	}
}

function UserDialogController($scope, $controller, $uibModalInstance, $log, DataService, noty)
{
	$controller('FormlyDialogController', {$scope: $scope});
	// ! IMPORTANT !
	$scope.initParent($uibModalInstance);
	var form_data = $scope.form_data

	if (!form_data) {
		$scope.dialogTitle = 'Create new user';
		$scope.buttonText = 'Save'
	} else {
		$scope.dialogTitle = 'Update user';
		$scope.buttonText = 'Update'
	}

	$scope.createForm(DataService.getUserSchema(), form_data, "AutocompleteUserController")

	$scope.save = function() {

		if (!$scope.formIsValid()) return false;

		var promise;
		if (form_data && form_data.id) 
			promise = DataService.updateUser(form_data.id, $scope.model);
		else
			promise = DataService.saveUser($scope.model);

		return $scope.closeDialog(promise)

	}
}

})();
