(function () {
    'use strict';
    //main aoolication name: coapp. ngRoute for page routing
    var app = angular.module('coapp', ['ngRoute', 'ui.bootstrap', 'angularFileUpload']);

    app.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider){

        //set template based on the url
        $routeProvider
        .when('/landing', {
            templateUrl: 'dev/js/views/landing.html',
            access:{
                requiredLogin: false
            }
        })
        .when('/login', {
            templateUrl: 'dev/js/views/Auth/login.html',
            controller: 'AuthController',
            controllerAs: 'authCtrl',
            access:{
                requiredLogin: false
            }
        })
        .when('/register',{
            templateUrl: 'dev/js/views/Auth/register.html',
            controller: 'AuthController',
            controllerAs: 'authCtrl',
            access:{
                requiredLogin: false
            }
        })
        .when('/projects', {
            templateUrl: 'dev/js/views/Projects/list.html',
            controller: 'ProjectsController',
            controllerAs: 'projectCtrl',
            access: {
                requiredLogin: true
            }
        })
        .when('/projects/:project_id', {
            templateUrl: 'dev/js/views/SingleProject/SingleProjectList.html',
            controller: 'SingleProjectController',
            controllerAs: 'SingProjectCtrl',
            access:{
                requiredLogin: false
            }
        })
        .when('/design/:design_id', {
            templateUrl: 'dev/js/views/Annotate/Annotate.html',
            controller: 'AnnotateController',
            controllerAs: 'AnnotateCtrl',
            access:{
                requiredLogin: false
            }
        }).otherwise({
            redirectTo: '/landing'
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

            $rootScope.isLoggedIn = AuthenticationFactory.isLogged;

            console.log($location.path() === '/landing');

            if (AuthenticationFactory.isLogged &&
                ($location.path() === '/login' || $location.path() === '/landing' || $location.path() === '/register')){
                $location.path('/projects');
            }
        });


    }]);

})();
