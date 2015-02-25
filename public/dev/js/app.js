(function () {
    'use strict';
    //main application name: coapp. ui-router for page routing
    angular.module('coapp', ['ui.router', 'ui.bootstrap', 'angularFileUpload', 'angularMoment', 'validation.match'])
    .config(appConfig)
    .run(appRun);

    // @ngInject
    //set up function to handle page routing and controllers
    function appConfig ($urlRouterProvider, $stateProvider, $httpProvider){
        //if any other url is entered direct the user to the landing page
        $urlRouterProvider.otherwise("/landing");
        //set template based on the url
        $stateProvider
        //state is the current url
        .state('landing', {
            url: '/landing',
            //use this template
            templateUrl: 'dev/js/views/landing.html',
            //user must be logged in to view this page
            access:{
                requiredLogin: false
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'dev/js/views/Auth/login.html',
            controller: 'AuthController',
            controllerAs: 'authCtrl',
            access:{
                requiredLogin: false
            }
        })
        .state('register',{
            url: '/register',
            templateUrl: 'dev/js/views/Auth/register.html',
            controller: 'AuthController',
            controllerAs: 'authCtrl',
            access:{
                requiredLogin: false
            }
        })
        .state('tasklist',{
            url: '/tasklist',
            templateUrl: 'dev/js/views/Task/taskLeftPanel.html',
            controller: 'TasksController',
            controllerAs: 'taskCtrl',
            access:{
                requiredLogin: true
            }
        })
        .state('tasklist.design', {
            url: '/design/:project_id',
            templateUrl: 'dev/js/views/Task/taskDesignPanel.html',
            controller: function($scope, $stateParams, $state, TaskProject){
                TaskProject.setId($stateParams.project_id);
            }
        })
        .state('projects', {
            url: '/projects',
            templateUrl: 'dev/js/views/Projects/list.html',
            activeLink: 'projects',
            controller: 'ProjectsController',
            controllerAs: 'projectCtrl',
            access: {
                requiredLogin: true
            }
        })
        .state('projects/:project_id', {
            url: '/projects/:project_id',
            templateUrl: 'dev/js/views/SingleProject/SingleProjectList.html',
            activeLink: 'projects',
            controller: 'SingleProjectController',
            controllerAs: 'SingProjectCtrl',
            access:{
                requiredLogin: true
            }
        })
        .state('design/:design_id', {
            url: '/design/:design_id',
            templateUrl: 'dev/js/views/Annotate/Annotate.html',
            activeLink: 'proejcts',
            controller: 'AnnotateController',
            controllerAs: 'AnnotateCtrl',
            access:{
                requiredLogin: true
            }
        });



        $httpProvider.interceptors.push('TokenInterceptor');

    }

    appConfig.$inject = ["$urlRouterProvider", "$stateProvider", "$httpProvider"];

    // @ngInject
    function appRun ($rootScope, $window, $location, AuthenticationFactory, alertService) {
        AuthenticationFactory.check();

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams ){
            alertService.close();

            if((toState.access && toState.access.requiredLogin) && !AuthenticationFactory.isLogged) {
                 event.preventDefault();
                $location.path('/login');
            } else {
                if(!AuthenticationFactory.user && !AuthenticationFactory.username) {
                    AuthenticationFactory.user = $window.localStorage.user;
                    AuthenticationFactory.username = $window.localStorage.username;
                }
            }
        });


        $rootScope.$on('$stateChangeSuccess', function (event, nextRoute, currentRoute){
            // console.log('current',currentRoute);
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

    appRun.$inject = ["$rootScope", "$window", "$location", "AuthenticationFactory", "alertService"];


})();
