(function(){

    angular.module('coapp')
    .directive('draggable', drag);

    // @ngInject
    function drag ($document, AnnotateFactory, $routeParams, $timeout) {

        var parentDiv = angular.element( document.querySelector( '#annotation-img'))[0];

        return function(scope, element, attr) {

            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;

            var markOffset = {
                x: 25,
                y: 18
            };

            var pageOffset = {
                x: parentDiv.getBoundingClientRect().left + markOffset.x,
                y: parentDiv.getBoundingClientRect().top + markOffset.y
            };

            var outOfBOunds = false;

            element.on('mousedown', function(e) {
                // Prevent default dragging of selected content
                e.preventDefault();

                startX = (e.pageX - pageOffset.x);
                startY = (e.pageY - pageOffset.y);

                $timeout(function(){
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                }, 0);

            });

            function mousemove(e) {
                e.preventDefault();

                if (attr.openComment === 'true') {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    return;
                }

                console.log('new', e.pageY);

                x = (e.pageX - pageOffset.x);
                y = (e.pageY - pageOffset.y);

                if(x < 0 || y < 0) {
                    setPos(startX, startY);
                    outOfBOunds = true;
                    return;
                }

                setPos((startX + (x - startX)),(startY + (y - startY)));
            }

            function mouseup() {

                var annotation = {
                    _id: attr.annotationId,
                    x: x + 15,
                    y: y + 15
                };

                console.log('annotation', annotation);

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