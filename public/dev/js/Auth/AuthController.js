(function(){
	angular.module('coapp')
	.controller('AuthController', regController);

	/**
	 * @ngInject
	 */
	function regController($window, $location, AuthFactory, AuthenticationFactory, $rootScope){

		var _this = this;

		//set up
		_this.alerts = [];

		// expose username
		_this.username = AuthenticationFactory.username;

		/**
		 * removes bootstrap alert
		 * @param  {[type]} index
		 * @return {[type]}
		 */
		_this.closeAlert = function(index){
			_this.alerts.splice(index, 1);
		}

		_this.addAlert = function (alert) {
			_this.alerts.push(alert);
		}

		_this.register = function(user){
			_this.alerts = [];

			if(!user || !user.email || !user.password) {
				_this.user = {};
				var err = {
					type: 'danger',
					msg: 'invalid data'
				}
				_this.addAlert(err);
			} else {
				AuthFactory
					.register(user)
					.then(function(data){

						$location.path('/login');

					}, function(error){
						_this.user = {};

						var err = {
							type: 'danger',
							msg: error
						}

						_this.addAlert(err);
					});
			}

		}; // register

		_this.login = function(user){
			_this.alerts = [];

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

				}, function(error){
					_this.user = {};
					var err = {
						type: 'danger',
						msg: error
					}
					_this.alerts.push(err);

				});

		};

		 _this.logout = function () {

            AuthFactory.logout();
            $location.path('/login');
        }

	}
	regController.$inject = ["$window", "$location", "AuthFactory", "AuthenticationFactory"];

})();
