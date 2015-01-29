(function(){

    angular.module('coapp')
    .directive('draggable', drag);

    // @ngInject
    function drag ($document, AnnotateFactory, $routeParams) {

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

            element.on('mousedown', function(e) {
                // Prevent default dragging of selected content
                e.preventDefault();

                // if () {

                // }
                // if open do nothing

                // check if user is owner of annotation
                // if not do nothing

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
            }

            function mouseup() {

                var annotation = {
                    _id: attr.annotationId,
                    x: x + 15,
                    y: y + 15
                };

                AnnotateFactory
                    .updateAnnotation(annotation, $routeParams.design_id)
                    .then(function (data) {
                        // reload page

                    }, function (err) {

                    });

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