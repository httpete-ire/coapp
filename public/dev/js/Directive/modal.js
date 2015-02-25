(function () {

    'use strict';

    angular.module('coapp')
    .directive('modal', modal);

    /**
     * @ngInject
     */
    function modal ($modal) {

        // set template directory of modal views
        var modalViews = 'dev/js/views/Modals/';

        return {
            transclude: true,
            restrict: 'EA',
            // click event uses the open function of the directive
            template: '<span ng-click="open()" ng-transclude></span>',
            scope: {
                size: '@',
                ctrl: '@',
                ctrlAs: '@',
                id: '@',
                name:'@'
            },
            link: function (scope, element, attrs) {

                scope.open = function(){

                    // create a new instance of the modal using
                    // the values passed to the directive
                    // values include : template, controller and modal size
                    var modalInstance = $modal.open({
                        templateUrl: modalViews + attrs.template + '.html',
                        controller: scope.ctrl,
                        controllerAs: scope.ctrlAs,
                        windowClass: 'app-modal-window',
                        backdrop: true,
                        size: scope.size || 'lg',
                        resolve: {
                            object: function(){
                                return {
                                    id: scope.id,
                                    name: scope.name
                                };
                            }
                        }
                    });
                }

            }
        };

    }

    modal.$inject = ["$modal"];

})();