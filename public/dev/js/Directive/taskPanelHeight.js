(function () {

    'use strict';

    angular.module('coapp')
    .directive('panelHeight', panelHeight);


    function panelHeight($window){
    	return function (scope, elem, attr) {

    		var windowHeight = ($window.innerHeight / 100) * 87;

    		elem.css({
    			height: windowHeight + 'px'
    		});

    	};
    }

	panelHeight.$inject = ["$window"];

})();