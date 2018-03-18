(function() {
  'use strict';

angular.module('web').service('api', RestApiService);

function RestApiService($http, $q, AuthService2, $log, $httpParamSerializerJQLike) {

    var self = this;
    self.API_URL = process.env.apiUrl + '/';
    self.AUTH_URL = process.env.authApiUrl + '/';

    self.endpoints = {
        check: 'status',
        logged: 'profile',
        login: 'login',
        tokens: 'tokens',
        logout: 'logout',
        admin: 'verifyadmin'
    };


    self.getOrDefault = function (value, mydefault) {
        return typeof value !== 'undefined' ? value : mydefault;
    };

    self.apiCall = function (endpoint, method, data, id, returnRawResponse, skipPromiseResolve, formData, requestConfig)
    {

      ////////////////////////
        //DEFAULTS
        returnRawResponse = self.getOrDefault(returnRawResponse, false);
        endpoint = self.getOrDefault(endpoint, self.endpoints.check);

        method = self.getOrDefault(method, 'GET');
        skipPromiseResolve = self.getOrDefault(skipPromiseResolve, false);
        formData = self.getOrDefault(formData, false);
        requestConfig = self.getOrDefault(requestConfig, {});

        var params = {};
        if (method == 'GET') {
            params = self.getOrDefault(data, {});
            data = {};
        } else if (method == 'POST') {
            data = self.getOrDefault(data, {});
        }

        var currentUrl = self.API_URL + endpoint;
//////////////////////////////
// WARNING PORCATA
        if (endpoint == self.endpoints.login)
            currentUrl = self.AUTH_URL + endpoint;
        else if (endpoint == self.endpoints.logged)
            currentUrl = self.AUTH_URL + endpoint;
        else if (endpoint == self.endpoints.tokens)
            currentUrl = self.AUTH_URL + endpoint;
        else if (endpoint == self.endpoints.logout) {
            currentUrl = self.AUTH_URL + endpoint;
        }
//////////////////////////////

        if (typeof id !== 'undefined' && method != 'POST') {
            currentUrl += '/' + id;
        }

        var contentType = 'application/json';
        if (formData) {
            data = $httpParamSerializerJQLike(data)
            contentType = 'application/x-www-form-urlencoded';
        }

        var token = AuthService2.getToken(),
            timeout = 30000,
            req = {
                method: method,
                url: currentUrl,
                headers: {
                    'Content-Type': contentType,
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                },
                data: data,
                params: params,
                timeout: timeout,
            }

        for (var v in requestConfig) {
            req[v] = requestConfig[v]
        }

        if (skipPromiseResolve) return $http(req);

        return $http(req).then(
            function successCallback(response) {
                //$log.debug("API call successful");

                if (returnRawResponse) {
                    console.log(response);
                    return response;
                }

                if (response.status == 204) {
                    if (response.data == "") {
                        response.data = {}
                        response.data.Response = ""
                    }
                }

                return response.data.Response;
          }, function errorCallback(response) {
                $log.warn("API failed to call")

                if (returnRawResponse) return $q.reject(response);

                if (!response.data || !response.data.hasOwnProperty('Response')) {
                    return $q.reject(null);
                }
                if (typeof response.data.Response === 'undefined') {
                    return $q.reject(null);
                }

                return $q.reject(response.data.Response);
        });
    }
};
RestApiService.$inject = [
    "$http", "$q", "AuthService2", "$log", "$httpParamSerializerJQLike"
];

})();
