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

    self.setDefaultForm = function() {
        self.panelTitle = "Provide your credentials"
        self.buttonText = "Signin"
        self.askUsername = true;
        self.askPassword = true;
        self.askNewPassword = false;
        self.askTOTP = false;
        self.userMessage = null;
        self.qr_code = null;

        self.user = {
           new_password: null,
           password_confirm: null,
           totp_code: null,
        };
    }
    self.setDefaultForm();

    // Init the models


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
            function (response) {
                self.userMessage = null;

                // Now we can check again reloading this page
                $window.location.reload();
                console.log("DO YOU SEE ME?")
                noty.showAll(response.data.Response.errors, noty.WARNING);

            }, function(response) {

                if (response.status == 409) {
                    $log.warn("Auth raised errors", response);
                    noty.showAll(response.data.Response.errors, noty.WARNING);
                } else if (response.status == 403) {
                    $log.warn("Auth not completed", response);

                    self.userMessage = "Unrecognized response from server"

                    if (typeof response.data.Response.data.actions === 'undefined') {
                        noty.showError(self.userMessage)
                        noty.showAll(response.data.Response.errors, noty.ERROR);
                    } else if (! (response.data.Response.data.actions instanceof Array)) {
                        noty.showError(self.userMessage)
                        noty.showAll(response.data.Response.errors, noty.ERROR) 
                    // } else if (typeof response.data.Response.data.token === 'undefined') {
                    //     noty.showError(self.userMessage)
                    //     noty.showAll(response.data.Response.errors, noty.ERROR);
                    } else {
                        var originalUerMessage = self.userMessage
                        self.userMessage = response.data.Response.errors[0];

                        // var temp_token = response.data.Response.data.token
                        var actions = response.data.Response.data.actions

                        for (var i=0; i<actions.length; i++) {
                            var action = actions[i];
                            var notyLevel = noty.ERROR;
                            if (action == 'FIRST LOGIN') {
                                self.panelTitle = "Change your temporary password"
                                self.buttonText = "Change"
                                self.askUsername = false;
                                self.askPassword = false;
                                self.askNewPassword = true;
                                notyLevel = noty.WARNING;

                            } else if (action == 'PASSWORD EXPIRED') {
                                self.panelTitle = "Change your password"
                                self.buttonText = "Change"
                                self.askUsername = false;
                                self.askPassword = false;
                                self.askNewPassword = true;
                                notyLevel = noty.WARNING;

                            } else if (action == 'TOTP') {
                                self.panelTitle = "Provide your authorization code"
                                self.buttonText = "Authorize"
                                self.askUsername = false;
                                self.askPassword = false;
                                self.askTOTP = true
                                notyLevel = noty.WARNING;
                                
                            } else {
                                self.userMessage = originalUerMessage;
                                noty.showError(self.userMessage)
                            }
                            noty.showAll(response.data.Response.errors, notyLevel);

                        }

                        if (response.data.Response.data.qr_code) {

                            self.qr_code = response.data.Response.data.qr_code;

                        }
                        // $auth.setToken(temp_token)
                    }

                } else {
                    // $log.warn("Auth: failed", response);
                    self.setDefaultForm();
                    noty.showAll(response.data.Response.errors, noty.ERROR);
                    self.userMessage = response.data.Response.errors[0];
                }

            }
        );
    }

    self.sendTOTP = function() {
        console.log("TOTP not yet implemented")
    }

    self.firstLogin = function() {
        console.log("firstLogin not yet implemented")
    }

    self.changePassword = function() {
        console.log("changePassword not yet implemented")
    }
}

function RegisterController($scope, $log, $auth, api, noty)
{
    // Init controller
    var self = this;
    self.errors = null;
    self.userMessage = null;
    $log.debug("Register Controller");

    // Skip if already logged
    if ($auth.isAuthenticated())
    {
        $timeout(function () {
            $log.debug("Already logged");
            $state.go(loggedLandingPage);
        });
    }

    // Init the model
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