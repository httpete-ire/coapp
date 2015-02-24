(function(){
	angular.module('coapp')
	.controller('AuthController', regController);

	/**
	 * @ngInject
	 */
	 //controlles login and logout of user
	function regController (alertService, $window, $location, AuthFactory, AuthenticationFactory, $rootScope) {

		var _this = this;

		_this.alertService = alertService;

		// expose username
		_this.username = AuthenticationFactory.username;

		//register a new user through form on register view
		_this.register = function(form, valid, user){
			//if the form is not valid return
			if(!valid){
				return false;
			}
			//if any form fields are invalid set the user to a blank object
			if(!user || !user.email || !user.password) {
				_this.user = {};
			} else {
				//call the register method from the Authentication service
				AuthFactory
					.register(user)
					.then(function(data){
						//if the user has registerd successfully direct them to the login page
						$location.path('/login');
					}, function(error){
						//if an error set the user to a blank object
						_this.user = {};
						//pass an error to the alert service
						_this.alertService.setAlert(error);
						//reset the form
						form.$setUntouched();
						form.$setPristine();
					});
			}

		}; // register

		//hanlde a user login through the login view page
		_this.login = function(form, valid, user){
			//if the form is invald retun false and the user must try again
			if(!valid){
				return false;
			}
			//call login method from authentication service passing in the user
			//created from the form
			AuthFactory
				.login(user)
				.then(function(data){
					//set the isLogged variable to true in authentication service
					AuthenticationFactory.isLogged = true;
					//set the user details
					AuthenticationFactory.user = data.user;
					AuthenticationFactory.username = data.username;
					//set up the user token, which is passed through headers to verify the current user
					$window.localStorage.token = data.token;
					$window.localStorage.user = data.user;
					$window.localStorage.username = data.username;
					//direct the user to the projects page
					$location.path('/projects');
					_this.alertService.close();
				}, function(error){
					_this.user = {};
					_this.alertService.setAlert(error);
					// set form to valid
					form.$setUntouched();
					form.$setPristine();
				});

		};

		//when user selects to logout
		 _this.logout = function () {
		 	//call the logout function from authentication service
            AuthFactory.logout();
            //direct the user to the login form page
            $location.path('/login');
        }

	}

	regController.$inject = ["alertService", "$window", "$location", "AuthFactory", "AuthenticationFactory"];

})();
