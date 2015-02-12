(function () {
    'use strict';

    angular.module('coapp')
    .controller('SidebarController', SidebarController);

    /**
     * [SidebarController description]
     * @param {[type]} $route [description]
     *
     * @ngInject
     */
    function SidebarController($state) {

        var _this = this;

        // expose the state provider
        // so active links can be set
        _this.state = $state;

    }

    SidebarController.$inject = ["$state"];

})();
