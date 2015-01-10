(function(){


    angular.module('coapp')
    .controller('AnnotateController', AnnotateCtrl);

    // @ngInject
    function AnnotateCtrl(AnnotateFactory, focus, $routeParams, AuthenticationFactory){

        _this = this;

        _this.design = {};

        _this.openComment = false;
        _this.commentSelected = null;

        _this.newAnnotation = null;

        _this.assignTask = false;

        _this.getDesign = function(){
            AnnotateFactory.getDesign($routeParams.design_id)
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
                .addAnnotation(annotation, $routeParams.design_id)
                .then(function(data){
                    _this.newAnnotation = null;
                    _this.getDesign();
                    _this.assignTask = false;
                });
        }

        _this.clearForm = function () {
            _this.newAnnotation = null;
            _this.assignTask = false;
        }

        _this.toggleAssign = function () {
            _this.assignTask = !_this.assignTask;
        }

        _this.addComment = function (comment, annotation, form) {



            AnnotateFactory
            .addComment(comment, $routeParams.design_id, annotation._id)
            .then(function(data) {
                // add new comment object to list of comments
                var newComment = {};
                newComment.body = comment.body;
                newComment.created = Date.now();
                newComment.owner = {};
                newComment.owner.username = AuthenticationFactory.username;

                _this.comment = null;
                // set form to valid
                form.commentForm.$setUntouched();
                form.commentForm.$setPristine();

                // add new comment
                annotation.comments.push(newComment);
            });
        }

        _this.getDesign();

    }

    AnnotateCtrl.$inject = ["AnnotateFactory", "focus", "$routeParams", 'AuthenticationFactory'];

    function getMouse(e) {
        var target = e.target.getBoundingClientRect();

        return {
            x: e.clientX - target.left,
            y: e.clientY - target.top
        };

    }

})();