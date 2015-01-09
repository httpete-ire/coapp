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
    function SidebarController($route) {

        var _this = this;

        // expose the route provider
        // so active links can be set
        _this.route = $route;

    }

    SidebarController.$inject = ["$route"];

})();
