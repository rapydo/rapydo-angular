(function() {
  'use strict';

angular.module('web').service('CommonDataService', CommonDataService);

function CommonDataService($log, api, $q, jsonapi_parser) {
	var self = this;

    self.getUserSchema = function(study) {
        return api.apiCall("schemas/admin/users", 'GET');
    };

    self.getUsers = function() {
        var out = api.apiCall('admin/users', 'GET')
        return jsonapi_parser.parseResponse(out);
    };

    self.saveUser = function(data) {
        return api.apiCall('admin/users', 'POST', data);
    };

    self.deleteUser = function(user) {
        return api.apiCall('admin/users/'+user, 'DELETE');
    };

    self.updateUser = function(user, data) {
        return api.apiCall('admin/users/'+user, 'PUT', data);
    };

    self.getUserRoles = function(query) {
        var endpoint = 'role/'+query;
        return api.apiCall(endpoint, 'GET');
    };
	
}

})();