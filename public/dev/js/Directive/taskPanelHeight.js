(function () {

    'use strict';

    angular.module('coapp')
    .directive('panelHeight', panelHeight);

    //used on the task view page for scrollable div
    function panelHeight($window){
    	return function (scope, elem, attr) {
            //get the height of the window and set the div to 87% of that height
    		var windowHeight = ($window.innerHeight / 100) * 87;
            //set the css of the element
    		elem.css({
    			height: windowHeight + 'px'
    		});

    	};
    }

	panelHeight.$inject = ["$window"];

})();