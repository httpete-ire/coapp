
(function(){

    angular.module('coapp')
    .directive('draggable', drag)
    .service('containerCoords', containerCoords);

    /**
     * returns x and y coords of image container relative to the window
     * @return {object} : x and y coords
     */
    // @ngInject
    function containerCoords ($timeout) {

        // store the image div for x and y position
        var imgDiv = angular.element( document.querySelector( '#annotation-img'))[0];
        //get the offset from the window
        var imgDivRect = imgDiv.getBoundingClientRect();
        //offset the x and y by the with and height of the annotation to center it
        var markOffset = {
            x: 15,
            y: 15
        };
        //an object to store the coordinates needed
        var coords = {
            x: imgDivRect.left + markOffset.x,
            y: imgDivRect.top + markOffset.y,
            width: imgDivRect.width,
            height: imgDiv.offsetHeight,
            left: imgDivRect.left
        };

        // when the page renders it reads the incorrect left position
        // of the img container, this timeout will execute when the page
        // has finished rendering thus giving the correct left postition
        $timeout(function(){
            coords.x = imgDiv.getBoundingClientRect().left + markOffset.x;
            coords.y = imgDiv.getBoundingClientRect().top + markOffset.y;
            coords.height = imgDiv.offsetHeight;
        }, 0);

        // an object of the coords of the img container
        return coords;
    }

    // @ngInject
    function drag ($document, AnnotateFactory, $stateParams, $timeout, containerCoords, AuthenticationFactory) {

        return function(scope, element, attr) {

            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;
            //used to check if an annotaion is dragged off the image
            var outOfBOunds = false;
            //event listener for mousedown
            element.on('mousedown', function(e) {
                //get the x and y of mouse
                startX = (e.pageX - containerCoords.x);
                startY = (e.pageY - containerCoords.y);

                // check if user is owner of annotation
                // and if not return
                // else set event listeners
                if ((attr.openComment === 'true') || (!AuthenticationFactory.isOwner(attr.owner))) {
                    return;
                }
                //add a class to allow for dragging the annotation
                element.addClass('drag-mark');
                //set up mouseMove and mouseUp listeners
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);

            });

            //function to set new x and y position of annotation
            function mousemove(e) {
                e.preventDefault();

                x = (e.pageX - containerCoords.x);

                y = (e.pageY - containerCoords.y);

                var pageWidth = (containerCoords.width + containerCoords.x - containerCoords.x);

                // if the mark goes out of the image
                // return it to its start location
                if(x < 0 || (x > pageWidth)|| (y < 0)) {
                    setPos(startX, startY);
                    outOfBOunds = true;
                    return;
                }
                //set the new x and y
                setPos(x ,(startY + (y - startY)));

            }

            //when the user releases the mouse
            function mouseup() {
                //remove the class drag-mark to stop the annotation from being draggable
                element.removeClass('drag-mark');

                if (startX === (startX - x) || startY === (startY - y) ||outOfBOunds) {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    return;
                }

                var annotation = {
                    _id: attr.annotationId,
                    x: x + 15,
                    y: y + 15
                };


                //call the update Annotation function to set its new coordinates
                AnnotateFactory
                    .updateAnnotation(annotation, $stateParams.design_id)
                    .then(function (data) {
                        // reload page
                    }, function (err) {

                });
                //remove event listeners
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