(function () {
    'use strict';

    var app = angular.module('coapp', ['ngRoute', 'ui.bootstrap']);

    app.config(function($routeProvider, $httpProvider){

        function checkLoggedIn($q, $log, authService) {
                    var deferred = $q.defer();

                    if (!authService.isAuthenticated()) {
                        $log.log('authentication required. redirect to login');
                        deferred.reject({ needsAuthentication: true });
                    } else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                }

        $routeProvider.whenAuthenticated = function (path, route) {
            route.resolve = route.resolve || {};
            angular.extend(route.resolve, { isLoggedIn: ['$q', '$log', 'authService', checkLoggedIn] });
            return $routeProvider.when(path, route);
        };

        $routeProvider
        .when('/login', {
            templateUrl: 'dev/js/views/login.html',
            controller: 'AuthController',
            controllerAs: 'authCtrl',
            access:{
                requiredLogin: false
            }
        })
        .when('/register',{
            templateUrl: 'dev/js/views/register.html',
            controller: 'AuthController',
            controllerAs: 'authCtrl',
            access:{
                requiredLogin: false
            }
        })
        .when('/projects', {
            templateUrl: 'dev/js/views/projects.html',
            controller: 'projectController',
            controllerAs: 'projectCtrl',
            access: {
                requiredLogin: true
            }
        }).otherwise({
          redirectTo: '/login'
        });

        $httpProvider.interceptors.push('TokenInterceptor');

    });//config
    // @ngInject
    app.run(function($rootScope, $window, $location, AuthenticationFactory){
        AuthenticationFactory.check();

        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute){

            if((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
                 event.preventDefault();        // hack to prevent page loading
                $location.path('/login');
            } else {
                if(!AuthenticationFactory.user) {
                    AuthenticationFactory.user = $window.localStorage.user;
                }
            }
        });

        $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute){
            $rootScope.showMenu = AuthenticationFactory.isLogged;
            if (AuthenticationFactory.isLogged && $location.path() === '/login'){
                $location.path('/projects');
            }
        });


    });

})();
