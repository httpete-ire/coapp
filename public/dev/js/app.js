(function () {
    'use strict';
    //main aoolication name: coapp. ngRoute for page routing
    angular
    .module('coapp', ['ngRoute', 'ui.bootstrap', 'angularFileUpload'])
    .config(appConfig)
    .run(appRun);

    // @ngInject
    function appConfig ($routeProvider, $httpProvider){

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
                requiredLogin: true
            }
        })
        .when('/design/:design_id', {
            templateUrl: 'dev/js/views/Annotate/Annotate.html',
            controller: 'AnnotateController',
            controllerAs: 'AnnotateCtrl',
            access:{
                requiredLogin: true
            }
        }).otherwise({
            redirectTo: '/landing'
        });

        $httpProvider.interceptors.push('TokenInterceptor');

    }

    appConfig.$inject = ["$routeProvider", "$httpProvider"];

    // @ngInject
    function appRun ($rootScope, $window, $location, AuthenticationFactory) {
        AuthenticationFactory.check();

        // @ngInject
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute){

            if((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
                 event.preventDefault();        // hack to prevent page loading
                $location.path('/login');
            } else {
                if(!AuthenticationFactory.user && !AuthenticationFactory.username) {
                    AuthenticationFactory.user = $window.localStorage.user;
                    AuthenticationFactory.username = $window.localStorage.username;
                }
            }
        });

        // @ngInject
        $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute){

            $rootScope.isLoggedIn = AuthenticationFactory.isLogged;


            if($location.path().slice(0, 7) === '/design') {
                $rootScope.designPage = true;
            } else {
                $rootScope.designPage = false;
            }

            if (AuthenticationFactory.isLogged &&
                ($location.path() === '/login' || $location.path() === '/landing' || $location.path() === '/register')){
                $location.path('/projects');
            }
        });
    }

    appRun.$inject = ["$rootScope", "$window", "$location", "AuthenticationFactory"];


})();
