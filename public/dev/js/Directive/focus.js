(function () {

    'use strict';

    angular.module('coapp')
    .directive('setFocus', setFocus);

    /**
     *  set the focus of the element when the page loads
     *
     *  @ngInject
     */
    function setFocus ($timeout) {
        return {
            restrict: 'A',
            link : function (scope, elem, attr) {
                $timeout(function(){
                    elem[0].focus();
                }, 0);
            }
        };
    }

    setFocus.$inject = ["$timeout"];

})();