(function () {
    'use strict';

    var app = angular.module('coapp');

    app.controller('HeaderCtrl', headerController);

    function headerController (AuthFactory, $location) {
        var _this = this;

        _this.logout = function () {
            AuthFactory.logout();
            $location.path('/login');
        }
    }

})();