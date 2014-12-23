(function(){


    angular.module('coapp')
    .controller('AnnotateController', AnnotateCtrl);

    // @ngInject
    function AnnotateCtrl(AnnotateFactory, focus){

        _this = this;

        _this.design = {};

        _this.openComment = false;
        _this.commentSelected = null;

        _this.newAnnotation = null;

        _this.getDesign = function(){
            AnnotateFactory.getDesign()
            .then(function(data){
                _this.design = data;
                }, function(error){
                _this.design = {};
            });
        }

        _this.annotate = function(e) {

            var mouse = getMouse(e);

            var newAnnote = {};

            newAnnote.circle = {};

            newAnnote.circle.x = mouse.x;
            newAnnote.circle.y = mouse.y;
            newAnnote.circle.color = '#000';

            focus('focus-this');

            _this.newAnnotation = newAnnote;
        };

        _this.toggleComments = function (index) {
            _this.commentSelected = index;
            _this.openComment = !_this.openComment;
        }


        _this.checkCoords = function (coord, value) {
            return coord > value;
        }

        _this.addAnnotation = function(annotation) {
            AnnotateFactory
                .addAnnotation(annotation)
                .then(function(data){
                    _this.newAnnotation = null;
                    _this.getDesign();
                });
        }

        _this.clearForm = function () {
            _this.newAnnotation = null;
        }

         _this.getDesign();

    }
    AnnotateCtrl.$inject = ["AnnotateFactory", "focus"];

    function getMouse(e) {
        var target = e.target.getBoundingClientRect();

        return {
            x: e.clientX - target.left,
            y: e.clientY - target.top
        };

    }

})();