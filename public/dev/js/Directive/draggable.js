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

        // image div
        var imgDiv = angular.element( document.querySelector( '#annotation-img'))[0];

        console.log(imgDiv.offsetHeight);

        var imgDivRect = imgDiv.getBoundingClientRect();

        var markOffset = {
            x: 15,
            y: 15
        };

        var coords = {
            x: imgDivRect.left + markOffset.x,
            y: imgDivRect.top + markOffset.y,
            width: imgDivRect.width,
            height: imgDivRect.height
        };

        // when the page renders it reads the incorrect left position
        // of the img container, this timeout will execute when the page
        // has finished rendering thus giving the correct left postition
        $timeout(function(){
            coords.x = imgDiv.getBoundingClientRect().left + markOffset.x;
            coords.y = imgDiv.getBoundingClientRect().top + markOffset.y;
        }, 0);

        // an object of the coords of the img container
        return coords;
    }

    // @ngInject
    function drag ($document, AnnotateFactory, $routeParams, $timeout, containerCoords, AuthenticationFactory) {

        return function(scope, element, attr) {

            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;

            var outOfBOunds = false;

            element.on('mousedown', function(e) {

                startX = (e.pageX - containerCoords.x);
                startY = (e.pageY - containerCoords.y);

                // check if user is owner of annotation
                // and if not return
                // else set event listeners
                if ((attr.openComment === 'true') || (!AuthenticationFactory.isOwner(attr.owner))) {
                    return;
                }

                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);

            });

            function mousemove(e) {
                e.preventDefault();

                // change the cursor to a 'move' cursor
                element.addClass('drag-mark');

                x = (e.pageX - containerCoords.x);

                y = (e.pageY - containerCoords.y);

                console.log(containerCoords.height);

                // if the mark goes out of the image
                // return it to its start location
                if(x < 0 || (x > (containerCoords.width + containerCoords.x))|| y < 0) {
                    setPos(startX, startY);
                    outOfBOunds = true;
                    return;
                }

                setPos(x ,(startY + (y - startY)));
            }

            function mouseup() {

                var annotation = {
                    _id: attr.annotationId,
                    x: x + 15,
                    y: y + 15
                };

                element.removeClass('drag-mark');

                if (startX === (startX - x) || startY === (startY - y)) {
                    return;
                }

                if (!outOfBOunds) {
                    AnnotateFactory
                        .updateAnnotation(annotation, $routeParams.design_id)
                        .then(function (data) {
                            // reload page

                        }, function (err) {

                        });
                }

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