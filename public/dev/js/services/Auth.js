(function(){

	var coapp = angular.module('coapp');

	coapp.factory('AuthFactory', function($window, $location, $http, $q, AuthenticationFactory){

			var auth = {};

				auth.login = function(user){

					var defer = $q.defer();

					 $http.post('/auth/login', user)
						.success(function(data){
							defer.resolve(data);
						})
						.error(function(err, status){
							defer.reject(err);
						})

					return defer.promise;
				};

				auth.register = function(user){

					var defer = $q.defer();

					 $http.post('/auth/register', user)
						.success(function(data){
							defer.resolve(data);
						})
						.error(function(err, status){
							defer.reject(err);
						})

					return defer.promise;
				};

				auth.logout = function($location) {
					if (AuthenticationFactory.isLogged) {
						AuthenticationFactory.isLogged = false;

						delete $window.localStorage.user;
						delete $window.localStorage.token;

						delete AuthenticationFactory.user;
					}
				};

			return auth;

	});

	//////////////////
	coapp.factory('AuthenticationFactory', function($window){

		var auth = {};

		auth.isLogged = false;

		auth.check = function () {
			if($window.localStorage.token && $window.localStorage.user) {
				this.isLogged = true;
			} else {
				this.isLogged = false;
				delete this.user;
			}
		}

		return auth;
	});

	coapp.factory('TokenInterceptor', function($window, $location, $q){

		var tokenIntercept = {};

		tokenIntercept.request = function(config){
			config.headers = config.headers || {};
			if($window.localStorage.token){
				config.headers.auth = "Bearer " + $window.localStorage.token;
			}
			return config;
		};

		tokenIntercept.responseError = function (rejection) {
			console.log(rejection);

			return $q.reject(rejection);
		};

		tokenIntercept.response = function(response){
			return response || $q.when(response);
		}

		return tokenIntercept;

	});


})();








