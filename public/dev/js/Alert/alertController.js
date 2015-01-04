(function () {
    'use strict';

    angular
    .module('coapp')
    .controller('AlertCtrl', alertCtrl);

    /**
     * @ngInject
     */
    function alertCtrl (alertService) {
        var _this = this;

        _this.alertService = alertService;

        _this.closeAlert = function () {
            _this.alertService.showAlert = false;
        }

    }

    alertCtrl.$inject = ["alertService"];

})();
