(function() {
  'use strict';

angular.module('web')
.controller('LoginController', LoginController)
.controller('LogoutController', LogoutController);

//////////////////////////////
function LoginController(
    $log, $window, AuthService2, $document, $timeout, $state, noty) {

    // Init controller
    $log.debug("Login Controller");
    var self = this;

    console.log(AuthService2.getToken());

    self.setDefaultForm = function() {

        self.panelTitle = "Provide your credentials"
        self.buttonText = "Signin"
        self.askUsername = true;
        self.askPassword = true;
        self.askNewPassword = false;
        self.askTOTP = false;
        self.allowRegistration = process.env.allowRegistration;
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
    if (AuthService2.isAuthenticated())
    {
        $timeout(function () {
            $log.debug("Already logged");
            $state.go(process.env.loggedLandingPage);
        });
    }

    // LOGIN LOGIC
    self.check = function() {

        var credentials = self.user;
        $log.debug("Requested with", credentials);

        AuthService2.login(credentials).then(
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

                    // self.userMessage = "Unrecognized response from server"
                    self.userMessage = ""

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
                        // self.userMessage = response.data.Response.errors[0];

                        // var temp_token = response.data.Response.data.token
                        var actions = response.data.Response.data.actions

                        for (var i=0; i<actions.length; i++) {
                            var action = actions[i];
                            var notyLevel = noty.ERROR;
                            if (action == 'FIRST LOGIN') {
                                self.panelTitle = "Please change your temporary password"
                                self.buttonText = "Change"
                                self.askUsername = false;
                                self.askPassword = false;
                                self.askNewPassword = true;
                                notyLevel = noty.WARNING;

                            } else if (action == 'PASSWORD EXPIRED') {
                                self.panelTitle = "Your password is expired, please change it"
                                self.buttonText = "Change"
                                self.askUsername = false;
                                self.askPassword = false;
                                self.askNewPassword = true;
                                notyLevel = noty.WARNING;

                            } else if (action == 'TOTP') {
                                self.panelTitle = "Provide the verification code"
                                self.buttonText = "Authorize"
                                self.askUsername = false;
                                self.askPassword = false;
                                self.askTOTP = true
                                notyLevel = noty.WARNING;
                                
                            } else {
                                self.userMessage = originalUerMessage;
                                noty.showError(self.userMessage)
                            }
                            // noty.showAll(response.data.Response.errors, notyLevel);

                        }

                        if (response.data.Response.data.qr_code) {

                            self.qr_code = response.data.Response.data.qr_code;

                        }
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
};

LoginController.$inject = [
    "$log", "$window", "AuthService2",
    "$document", "$timeout", "$state", "noty"
];


function LogoutController(
    $scope, $rootScope, $log, AuthService2, $window, $uibModal, $state, api, noty) {
    // Init controller
    $log.debug("Logout Controller");
    var self = this;

    function DialogController($scope, $uibModalInstance) {
        $scope.cancel = function() {
          $uibModalInstance.dismiss();
        };
        $scope.confirm = function(answer) {
          $uibModalInstance.close(answer);
        };
    };
    DialogController.$inject = ["$scope", "$uibModalInstance"];

    self.showConfirmDialog = function() {
        var template = "<div class='panel panel-danger text-center' style='margin-bottom:0px;'>";
            template+= "<div class='panel-heading'>Logout request</div>";
            template+= "<div class='panel-body'><h4>Do you really want to close this session?</h4></div>";
            template+= "<div class='panel-footer'>";

            template+= "<div class='row'>";
            template+= "<div class='col-xs-4 col-xs-offset-2'>";
            template+= "<button class='btn btn-danger' ng-click='confirm()'>Yes</button>";
            template+= "</div>";
            template+= "<div class='col-xs-4'>";
            template+= "<button class='btn btn-default' ng-click='cancel()'>No</button>";
            template+= "</div>";

            template+= "</div>";
            template+= "</div>";

        return $uibModal.open({
          controller: DialogController,
          template: template,
          parent: angular.element(document.body),
          clickOutsideToClose:true
        }).result;
    }

    self.exit = function() {

        self.showConfirmDialog().then(
            function(answer) {
                api.apiCall(api.endpoints.logout, 'GET', undefined, undefined, true) .then(
                    function(response) {
                        $log.info("Logging out", response);

                        AuthService2.logout();
                        $window.location.reload();
                        $rootScope.logged = false;
                        //$state.go('welcome');
                    }, function(error) {
                        $log.warn("Error for logout", error);
                        noty.showAll([error.data], noty.ERROR);
                    }
                );
            },
            function() {
                // user did'nt confirmed logout request
            }
        );


    }

};

LogoutController.$inject = [
    "$scope", "$rootScope", "$log", "AuthService2", "$window",
    "$uibModal", "$state", "api", "noty"
];

// THE END
})();