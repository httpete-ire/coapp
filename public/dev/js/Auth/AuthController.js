(function(){
	angular.module('coapp')
	.controller('AuthController', regController);

	/**
	 * @ngInject
	 */
	function regController (alertService, $window, $location, AuthFactory, AuthenticationFactory, $rootScope) {

		var _this = this;

		_this.alertService = alertService;

		// expose username
		_this.username = AuthenticationFactory.username;

		_this.register = function(user){

			if(!user || !user.email || !user.password) {
				_this.user = {};
			} else {
				AuthFactory
					.register(user)
					.then(function(data){

						$location.path('/login');

					}, function(error){
						_this.user = {};

						_this.alertService.setAlert(error);
						_this.alertService.sleep(3500);
					});
			}

		}; // register

		_this.login = function(form, valid, user){

			if(!valid){
				return false;
			}
			AuthFactory
				.login(user)
				.then(function(data){
					AuthenticationFactory.isLogged = true;
					AuthenticationFactory.user = data.user;
					AuthenticationFactory.username = data.username;

					$window.localStorage.token = data.token;
					$window.localStorage.user = data.user;
					$window.localStorage.username = data.username;

					$location.path('/projects');

					_this.alertService.close();

				}, function(error){
					_this.user = {};

					_this.alertService.setAlert(error);

					_this.alertService.sleep(3500);

					// set form to valid
					form.$setUntouched();
					form.$setPristine();
				});

		};

		 _this.logout = function () {

            AuthFactory.logout();
            $location.path('/login');
        }

	}

	regController.$inject = ["alertService", "$window", "$location", "AuthFactory", "AuthenticationFactory"];

})();
