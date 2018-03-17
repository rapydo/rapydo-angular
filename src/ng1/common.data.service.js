(function() {
  'use strict';

angular.module('web').service('CommonDataService', CommonDataService);

function CommonDataService(ApiService2, jsonapi_parser) {
	var self = this;

    self.getActiveSessions = function() {
       return ApiService2.get('tokens', "", [], {"base": "auth"}).toPromise(); 
    }
    self.revokeToken = function(id) {
       return ApiService2.delete('tokens', id, {"base": "auth"}).toPromise(); 
    }

    self.modifyProfile = function(data) {
        return ApiService2.put('profile', "", data, {"base": "auth"}).toPromise();
    };

    self.getUsers = function() {
        return jsonapi_parser.parseResponse(ApiService2.get('admin/users'));
    };

    self.saveUser = function(data) {
        return ApiService2.post('admin/users', data).toPromise();
    };

    self.deleteUser = function(user) {
        return ApiService2.delete('admin/users', user).toPromise();
    };

    self.updateUser = function(user, data) {
        return ApiService2.put('admin/users', user, data).toPromise();
    };

    self.getUserRoles = function(query) {
        return ApiService2.get('role', query).toPromise();
    };

    self.getUserGroups = function(query) {
        return ApiService2.get('group', query).toPromise();
    };
	
};

CommonDataService.$inject = ["ApiService2", "jsonapi_parser"];

})();