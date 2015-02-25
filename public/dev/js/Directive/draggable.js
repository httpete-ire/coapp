
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
            height: imgDiv.clientHeight,
            left: imgDivRect.left
        };

        // when the page renders it reads the incorrect left position
        // of the img container, this timeout will execute when the page
        // has finished rendering thus giving the correct left postition
        $timeout(function(){
            coords.x = imgDiv.getBoundingClientRect().left + markOffset.x;
            coords.y = imgDiv.getBoundingClientRect().top + markOffset.y;
        }, 0);

        /**
         * update x postition of the image, the window can resize so
         * the image moves so the new x coords must be updated
         *
         */
        coords.update = function () {
            var elem = angular.element( document.querySelector( '#annotation-img'))[0];
            this.x = elem.getBoundingClientRect().left + markOffset.x;
            this.height = elem.clientHeight;
        };

        // an object of the coords of the img container
        return coords;
    }

    // @ngInject
    function drag ($document, AnnotateFactory, $stateParams, $timeout, containerCoords, AuthenticationFactory) {

        return {
            scope: {
                data: '='
            },
            link: function (scope, element, attr) {

                var startX = 0,
                    startY = 0,
                    x = 0,
                    y = 0;

                //used to check if an annotaion is dragged off the image
                var outOfBOunds = false;

                //event listener for mousedown
                element.on('mousedown', function(e) {

                    // reset the x postition to zero
                    x = 0;

                     // update the offset value of the image
                     // this is done just incase the browser window was resized
                    containerCoords.update();

                    //get the x and y of mouse
                    startX = (e.pageX - containerCoords.x);
                    startY = (e.pageY - containerCoords.y);

                    // check if user is owner of annotation
                    // and if not return
                    // else set event listeners
                    if ((attr.openComment === 'true') || (!AuthenticationFactory.isOwner(attr.owner))) {
                        return false;
                    }

                    //set up mouseMove and mouseUp listeners
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);

                });

                //function to set new x and y position of annotation
                function mousemove(e) {
                    var pageWidth;

                    //add a class to allow for dragging the annotation
                    element.addClass('drag-mark');

                    e.preventDefault();

                    // calcualte the postition of the mouse in relation
                    // to the image container
                    x = (e.pageX - containerCoords.x);
                    y = (e.pageY - containerCoords.y);

                    // calculate the x postion of the edge of the image
                    pageWidth = (containerCoords.width + containerCoords.x - containerCoords.x);

                    // if the mark goes out of the image
                    // return it to its start location
                    if(x < 0 || (x > pageWidth)|| (y < 0) || y > containerCoords.height) {
                        setPos(startX, startY);
                        outOfBOunds = true;
                        return;
                    }

                    //set the new x and y
                    setPos(x ,(startY + (y - startY)));
                }

                /**
                 * when the mouse has been released on the annotation
                 *
                 */
                function mouseup() {

                    // remove the drag icon
                    element.removeClass('drag-mark');

                    // if the x postition hasnt moved
                    // we remove the event listeners
                    // and return false
                    if (x === 0 || outOfBOunds) {
                        $document.off('mousemove', mousemove);
                        $document.off('mouseup', mouseup);
                        return false;
                    }

                    // build an object so we can pass it to the update query
                    var annotation = {
                        _id: attr.annotationId,
                        x: x + 15,
                        y: y - 18.5
                    };

                    // set the new position on the annotation object
                    scope.data.circle.x = annotation.x;
                    scope.data.circle.y = annotation.y;

                    //call the update Annotation function to set its new coordinates
                    AnnotateFactory
                        .updateAnnotation(annotation, $stateParams.design_id)
                        .then(function (data) {
                        }, function (err) {
                    });

                    //remove event listeners
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }

                /**
                 * set the css postition on an element
                 * @param {Number} x
                 * @param {Number} y
                 */
                function setPos(x, y) {
                    element.css({
                        top: y + 'px',
                        left: x + 'px'
                    });
                }

            }
        }
    }

})();