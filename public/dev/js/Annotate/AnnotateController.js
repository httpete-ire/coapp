(function(){


    angular.module('coapp')
    .controller('AnnotateController', AnnotateCtrl);

    // @ngInject
    function AnnotateCtrl(AnnotateFactory, focus, $routeParams, AuthenticationFactory, SingProjFactory){

        _this = this;

        _this.design = {};
        _this.allDesigns = {};
        _this.openComment = false;
        _this.commentSelected = null;

        _this.newAnnotation = null;

        _this.assignTask = false;

        _this.openHead = false;

<<<<<<< HEAD
        _this.filterOptions = [
            {name : "text", on : false, klass : "text-type", type : 'type-text'},
            {name : "image", on : true, klass : "image-type", type : 'type-image'},
            {name : "color", on : true, klass : "color-type", type : 'type-color'},
            {name : "layout", on : true, klass : "layout-type", type : 'type-layout'}
        ];

       
        _this.typeIncludes = [];

        _this.includeType = function(type){

            var i = _this.typeIncludes.indexOf(type);

            if(i > -1){
                _this.typeIncludes.splice(i, 1);
            }else{
                _this.typeIncludes.push(type);
            }
        };

        _this.typeFilter = function(annotation){

            console.log(annotation);

            if( _this.typeIncludes.length > 0){
                if(_this.typeIncludes.indexOf(annotation.type)){
                    return;
                }
            }

            return annotation;
        };
       

        _this.toggle = function(){
            console.log(_this.openHead);
           
                if (_this.openHead == false){
                    _this.openHead = true;
                }
                else{
                    _this.openHead = false;
                }
            }

           _this.getAllDesigns = function(id){
            SingProjFactory.getProject(id)
=======
        _this.radioColor = 'type-text';

        /*
         *
         */
        _this.toggle = function () {
            _this.openHead = !_this.openHead;
        };

        /**
         * get design thumbnail for images
         *
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        _this.getAllDesigns = function (id) {
            SingProjFactory
            .getProject(id)
>>>>>>> 1dff6174d2bc94c52e4c2e376749715c9e01616d
            .then(function(data){
                _this.allDesigns = data;
                }, function(error){
                _this.allDesigns = {};
            });
        }
        
        

        _this.getDesign = function(){
            AnnotateFactory.getDesign($routeParams.design_id)
            .then(function(data){
                _this.design = data;
                _this.getAllDesigns(data.project._id);
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

            // bind the color type to the new annotation
            annotation.type = _this.radioColor;

            AnnotateFactory
                .addAnnotation(annotation, $routeParams.design_id)
                .then(function(data){
                    _this.newAnnotation = null;
                    _this.getDesign();
                    _this.assignTask = false;

                    // reset to default color
                    _this.radioColor = 'type-text';
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

        _this.matchDesignId = function (id) {
            return id === $routeParams.design_id;
        };

        _this.getDesign();

        

    }

    AnnotateCtrl.$inject = ["AnnotateFactory", "focus", "$routeParams", 'AuthenticationFactory', 'SingProjFactory'];

    function getMouse(e, targ) {

        var target = {};

        if (targ) {
            target = targ[0].getBoundingClientRect();
        } else {
            target = e.target.getBoundingClientRect();
        }

        console.log(target);

        return {
            x: e.clientX - target.left,
            y: e.clientY - target.top
        };

    }

})();