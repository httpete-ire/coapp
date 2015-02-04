(function () {

    'use strict';

    angular.module('coapp')
    .directive('setFocus', focus)
    .factory('focus', focusFactory);

    /**
     * @ngInject
     */
    function focus () {
        return function(scope, elem, attr) {
            scope.$on('setFocus', function(e, name) {
                if(name === attr.setFocus) {
                    elem[0].focus();
                }
            });
        };
    }

    function focusFactory ($rootScope, $timeout) {
        return function(name) {
          $timeout(function (){
            $rootScope.$broadcast('setFocus', name);
          });
        }
    }

    focusFactory.$inject = ["$rootScope", "$timeout"];


})();