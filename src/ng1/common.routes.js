(function() {
  'use strict';

angular.module('web').config(routeConfig);

// Check authentication via Token
function _redirectIfNotAuthenticated($log, $rootScope, $window, AuthService2, ApiService2) {
    //console.log("CHECK LOGGED");
    return ApiService2.verify(true).subscribe(
        function(response) {
            $log.debug("Checked: logged!")
            $rootScope.logged = true;
            $rootScope.profile = response;
            return true;

        }, function(error) {

            if (error.status == 0) {
                /*$log.error("Failed with", error.status);*/
                $rootScope.logged = false;
                $window.location.href = '/offline';
            } else {

                $rootScope.logged = false;
                if (AuthService2.getToken() !== null) {
                    // Token has expired...
                    $log.info("Removed token, because it seems expired.");
                    AuthService2.removeToken();
                } else {
                    $log.debug("Authentication check failed");

                }
                $window.location.href = '/new/login';
                return false;

            }
        }
    );
};

_redirectIfNotAuthenticated.$inject = [
    "$log", "$rootScope", "$window", "AuthService2", "ApiService2"
];

// Skip authentication
// Check for API available
function _skipAuthenticationCheckApiOnline($state, $timeout, AuthService2, $rootScope, ApiService2)
{
    return ApiService2.verify(false).subscribe(
        function(response) {
            // API available
            if (AuthService2.isAuthenticated()) {
                return ApiService2.verify(true).subscribe(
                    function(response) {
                        // Token is available and API confirm that is good
                        if (response && AuthService2.isAuthenticated()) {
                            $rootScope.logged = true;
                            $rootScope.profile = response;
                            return response;
                        }
                    }, function(error) {
                        AuthService2.removeToken();
                    }
                );
            }

            return response;

        }, function(error) {
            // API not available
            $rootScope.logged = false;
            $window.location.href = '/offline';
        }
    );

}
_skipAuthenticationCheckApiOnline.$inject = [
    "$state", "$timeout", "AuthService2", "$rootScope", "ApiService2"
]


/*********************************
* ROUTING
*********************************/
function routeConfig(
    $stateProvider,
    $logProvider, $locationProvider, $httpProvider, $injector,
    $urlRouterProvider
    )
{


// ROUTER CONFIGURATION

    // Enable log
    $logProvider.debugEnabled(false); //.hashPrefix('!');
    // HTML5 mode: remove hash bang to let url be parsable
    $locationProvider.html5Mode(true);

// Change angular variables from {{}} to [[]] ?
    // $interpolateProvider.startSymbol('[[').endSymbol(']]');

    // Performance:
    // make all http requests that return in around the same time
    // resolve in one digest
    // http://www.toptal.com/angular-js/top-18-most-common-angularjs-developer-mistakes #9b
    $httpProvider.useApplyAsync(true);

    // Faster http requests?
    //http://stackoverflow.com/a/29126922/2114395
    $httpProvider.defaults.headers.common["X-Requested-With"]
        = 'XMLHttpRequest';

////////////////////////////
// WHERE THE MAGIC HAPPENS

    // Dinamically inject the routes from the choosen blueprint
    var extraRoutes = {};
    var extraRoutesSize = 0;
    var blueprintRoutes = 'customRoutes';
    try {
        extraRoutes = $injector.get(blueprintRoutes);
        extraRoutesSize = Object.keys(extraRoutes).length;
        // console.debug("Loaded extra routes:", blueprintRoutes);
    } catch(e) {
        console.error("Error! Failed to find a JS object to define extra routes." +
            "\nIt should be called '" + blueprintRoutes + "'");
    }

// If i find out that APIs are not available...
    $stateProvider.state("offline", {
        url: "/_offline",
        views: {
            "main": {templateUrl: process.env.templateDir + 'offline.html'}
        }
    }).

// A public state
    state("public", {
        url: "/public",
        resolve: {
            skip: _skipAuthenticationCheckApiOnline,
        },
        views: {
            "main": {
                template: "<div ui-view='unlogged' style='height: calc(100% - 5rem);'></div>",
            }
        }
    }).

// Base for the app views
    state("logged", {
        url: "/app",
        // This parent checks for authentication and api online
        resolve: {
            redirect: _redirectIfNotAuthenticated
        },
        // Implement main route for landing page after login
        views: {
            "main": {
                template: "<div ui-view='loggedview' style='height: calc(100% - 5rem);'></div>",
            }
        },
    });

    // DEFINE BASE ROUTES
    var baseRoutes = {

        "logged.profile": {
            url: "/profile",
            views: {
                "loggedview@logged": {
                    dir: "base",
                    templateUrl: 'profile.html'
                }
            }
        },

        "logged.profile.sessions": {
            url: "/sessions",
            views: {
                "loggedview@logged": {
                    dir: "base",
                    templateUrl: 'token_sessions.html'
                }
            }
        },

        "logged.profile.changepassword": {
            url: "/changepassword",
            views: {
                "loggedview@logged": {
                    dir: "base",
                    templateUrl: 'changepassword.html'
                }
            }
        }
        // Routes definition ends here
    };

    /////////////////////////////////
    // FOR EACH AUTO IMPLEMENTATION
     //https://toddmotto.com/simple-foreach-implementation-for-objects-nodelists-arrays-with-automatic-type-looping/
    var forEach = function (collection, callback, scope) {
      if (Object.prototype.toString.call(collection) === '[object Object]') {
        for (var prop in collection) {
          if (Object.prototype.hasOwnProperty.call(collection, prop)) {
            callback.call(scope, collection[prop], prop, collection);
          }
        }
      } else {
        for (var i = 0; i < collection.length; i++) {
          callback.call(scope, collection[i], i, collection);
        }
      }
    };

    var allRoutes = angular.copy(extraRoutes);
    forEach(baseRoutes, function(x, stateName) {
        if (!allRoutes.hasOwnProperty(stateName)) {
            allRoutes[stateName] = x;
        }
    });

    function loadStates(states) {
        forEach(states, function(x, stateName){
            // Build VIEWS for this single state
            var myViews = {};
            forEach(x.views, function(view, viewName){
                var dir = process.env.templateDir;

                if (view.dir == 'blueprint') {
                    dir = process.env.blueprintTemplateDir;
                }
                myViews[viewName] = {templateUrl: dir + view.templateUrl};
            });

            var finalRoute = {
                url: x.url,
                params: x.params,
                views: myViews,
                // ON ENTER AND EXIT
                onEnter: x.onEnter,
                onExit: x.onExit,
            };

            // Add provider state to the ui router ROUTES
            $stateProvider.state(stateName, finalRoute);
        });

        // Used to clear out ui-view when angualar router is activated
        $stateProvider.state('empty', { url: "empty", template: ''});

    }
    // Build the routes from the blueprint configuration
    loadStates(allRoutes);

// Ui router kinda bug fixing
// CHECK THIS IN THE NEAR FUTURE
//https://github.com/angular-ui/ui-router/issues/1022#issuecomment-50628789
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get('$state');
        var u = $location.path();
        if (u.startsWith("/new")) {

            return $state.go('empty', {}, { location: false } );

        } 
        /*
        else if (u.startsWith("/app") || u.startsWith("/public")) {

            return $state.go('public.welcome');

        }
        */
    });

};   // END ROUTES

routeConfig.$inject = [
    "$stateProvider",
    "$logProvider",
    "$locationProvider",
    "$httpProvider",
    "$injector",
    "$urlRouterProvider"
];

})();
