(function () {
    'use strict';

    angular
    .module('coapp')
    .directive('appAlert', appAlert);

    /**
     *  directive for showing bootstrap alerts boxes
     *
     * @ngInject
     */
    function appAlert () {
        return {
            bindToController: true,
            controller: "AlertCtrl as appAlert",
            template: '<alert ng-if="appAlert.alertService.showAlert" type="{{ appAlert.alertService.alertType }}" >{{ appAlert.alertService.alertMessage }}</alert>'
        };
    }

})();