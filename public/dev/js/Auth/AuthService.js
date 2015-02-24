(function(){

    angular.module('coapp')
    .factory('AuthFactory', AuthFactory)
    .factory('TokenInterceptor', TokenInterceptor)
    .factory('AuthenticationFactory', AuthenticationFactory);

    // @ngInject
    //handles user data from the server to the application for authentication
    function AuthFactory($window, $location, $http, $q, AuthenticationFactory){
        //set up an object to append methods too
        var auth = {};

        //login for a user, pass a user as parameter
        auth.login = function(user){
            //set up the defer instance
            var defer = $q.defer();
            //make a post request passing in the user object
            $http.post('/auth/login', user)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                })
            //return the promise
            return defer.promise;
        };

        //register a new user to the system
        auth.register = function(user){
            //set up the promise instance
            var defer = $q.defer();
            //make a post request passing in the user object
             $http.post('/auth/register', user)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                })
            return defer.promise;
        };

        //logout a user
        auth.logout = function($location) {
            //if the user is logged in set the isLogged variable to false
            //then remove the user token and user from the localstorage
            if (AuthenticationFactory.isLogged) {
                AuthenticationFactory.isLogged = false;
                delete $window.localStorage.user;
                delete $window.localStorage.token;
                delete AuthenticationFactory.user;
            }
        };

        //return the auth object with appended methods
        return auth;
    }
    AuthFactory.$inject = ["$window", "$location", "$http", "$q", "AuthenticationFactory"];

    // @ngInject
    function AuthenticationFactory ($window){

        var auth = {};

        auth.isLogged = false;

        auth.username = '';

        auth.isOwner = function (id) {
            return $window.localStorage.user === id;
        }

        auth.check = function () {
            if($window.localStorage.token && $window.localStorage.user) {
                this.isLogged = true;
            } else {
                this.isLogged = false;
                delete this.user;
            }
        }

        return auth;
    }
    AuthenticationFactory.$inject = ["$window"];

    // @ngInject
    function TokenInterceptor ($window, $location, $q) {
        var tokenIntercept = {};

        tokenIntercept.request = function(config){
            config.headers = config.headers || {};
            if($window.localStorage.token){
                config.headers.auth = "Bearer " + $window.localStorage.token;
            }
            return config;
        };

        tokenIntercept.responseError = function (rejection) {
            return $q.reject(rejection);
        };

        tokenIntercept.response = function(response){
            return response || $q.when(response);
        }

        return tokenIntercept;
    }
    TokenInterceptor.$inject = ["$window", "$location", "$q"];


})();








