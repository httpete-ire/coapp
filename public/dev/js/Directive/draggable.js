(function(){

	angular.module('coapp')
	.directive('draggable', drag);

	// @ngInject
	function drag ($document) {

		var parentDiv = angular.element( document.querySelector( '#annotation-img'));


		return function(scope, element, attr) {

			var startX = 0, 
				startY = 0, 
				x = 0, 
				y = 0;

			var pageOffset = {
				x: 143,
				y: 165
			};

	    	element.on('mousedown', function(e) {
	        	// Prevent default dragging of selected content
	        	e.preventDefault();

	        	startX = (e.pageX - pageOffset.x);
	        	startY = (e.pageY - pageOffset.y);
	        
	        	$document.on('mousemove', mousemove);
	        	$document.on('mouseup', mouseup);

	    	});

	    	function mousemove(e) {
	    		e.preventDefault();

	    		x = (e.pageX - pageOffset.x) + 15;
	    		y = (e.pageY - pageOffset.y);



	    		if(x < 0 || y < 0) {
	    			mouseup();
	    			setPos(startX, startY);
	    			return;
	    		}


	    		setPos(x, y);

	    		// update annotation using service
	    	}

	    	function mouseup() {
	      		$document.off('mousemove', mousemove);
	      		$document.off('mouseup', mouseup);
	    	}

	    	function setPos(x, y) {
	    		element.css({
	        		top: y + 'px',
	        		left: x + 'px'
	      		});
	    	}

	  	};

	}

})();	