(function () {
    'use strict';

    var app = angular.module('coapp', ['ngRoute', 'ui.bootstrap']);

    app.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider){

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

    }]);//config

    // @ngInject
    app.run(["$rootScope", "$window", "$location", "AuthenticationFactory", function($rootScope, $window, $location, AuthenticationFactory){
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


    }]);

})();
