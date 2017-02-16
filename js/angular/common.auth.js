(function() {
  'use strict';

angular.module('web')
//.service('auth', authService)
.controller('LoginController', LoginController)
.controller('RegisterController', RegisterController)
.controller('LogoutController', LogoutController)

.config(function($authProvider) {

    $authProvider.loginUrl = authApiUrl + "/login"
    $authProvider.tokenName = 'token';
    $authProvider.tokenRoot = 'Response.data'

	$authProvider.oauth1({
		  name: null,
		  url: null,
		  authorizationEndpoint: null,
		  redirectUri: null,
		  type: null,
		  popupOptions: null
	});

})
;

//////////////////////////////
function LoginController($scope, $log, $window,
    $auth, $document, $timeout, $state, noty)
{

    // Init controller
    $log.debug("Login Controller");
    var self = this;
    self.userMessage = null;

    // Init the models
    self.user = {
       username: null,
       password: null,
    };

    // In case i am already logged, skip
    if ($auth.isAuthenticated())
    {
        $timeout(function () {
            $log.debug("Already logged");
            $state.go(loggedLandingPage);
        });
    }

    // LOGIN LOGIC
    self.check = function() {

        var credentials = self.user;
        $log.debug("Requested with", credentials);

        $auth.login(credentials).then(
            function (loginResponse) {
                self.userMessage = null;
                // $log.info("Login request", loginResponse);
                //console.log($auth.getToken());
                //$rootScope.logged = true;

                // Now we can check again reloading this page
                $window.location.reload();
                console.log("DO YOU SEE ME?")
                noty.showAll(loginResponse.data.errors, noty.WARNING);

            }, function(errorResponse) {

                $log.warn("Auth: failed", errorResponse);
                noty.showAll(errorResponse.data.errors, noty.ERROR);

            }
        );
    }
}

function RegisterController($scope, $log, $auth, api, noty)
{
    // Init controller
    var self = this;
    self.errors = null;
    self.userMessage = null;
    $log.debug("Register Controller");

    // In case i am already logged, skip
    if ($auth.isAuthenticated())
    {
        $timeout(function () {
            $log.debug("Already logged");
            $state.go(loggedLandingPage);
        });
    }

    // Init the models
    self.user = {
       email: null,
       name: null,
       surname: null,
       password: null,
       password_confirm: null,
    };

    self.request = function()
    {
        var credentials = self.user;
        if (credentials.name == null || credentials.surname == null)
            return false;

        $log.debug("Requested registration:", credentials);

        api.apiCall(api.endpoints.register, 'POST', credentials, null, true)
         .then(
            function(response) {
                $log.debug("REG Success call", response);

                if (response.status > 210) {
                    var errors = response.data.errors;
                    $log.warn("Registration: failed", errors);
                    self.errors = errors;
                    noty.showError("Failed to register...")
                } else {
                    noty.showSuccess("New user created")
                    self.errors = null;
                    self.userMessage =
                        "Account registered. Pending admin approval.";
                }
            }
        );

    }
}


function LogoutController($scope, $rootScope, $log, $auth, $window, $state, api, noty)
{
    // Init controller
    $log.debug("Logout Controller");
    var self = this;

    // Log out satellizer
    self.exit = function() {

        // I am going to call log out on the python frontend
        api.apiCall(
            api.endpoints.logout, 'GET',
            undefined, undefined, true)
         .then(
          function(response) {
            $log.info("Logging out", response);

/*
            console.log("LOGOUT IS ON PROGRESS AT THE MOMENT");
*/
        	$auth.logout().then(function() {
                $log.debug("Token cleaned:", $auth.getToken());
            });
            $window.location.reload();
            $rootScope.logged = false;
            //$state.go('welcome');
          }, function(error) {
            $log.warn("Error for logout", error);
            noty.showAll([error.data], noty.ERROR);
          }
        );

    }

}

// THE END
})();