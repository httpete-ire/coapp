(function () {
    'use strict';

    angular
    .module('coapp')
    .service('alertService', alertService);

    /**
     * @ngInject
     */
    function alertService () {

        var alertService = this;

        alertService.alertMessage = "Something Failed";
        alertService.alertType = "danger";
        alertService.showAlert = false;

        alertService.show = function () {
            alertService.showAlert = true;
        }

        alertService.close = function () {
            alertService.showAlert = false;
        }

        alertService.setAlert = function (err) {
            alertService.alertMessage = err;
            alertService.showAlert = true;
        }
    }

})();