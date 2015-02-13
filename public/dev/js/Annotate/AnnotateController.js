(function(){


    angular.module('coapp')
    .controller('AnnotateController', AnnotateCtrl)
    .factory('FilterOpts', filterOptions);

    function filterOptions () {
        var opts = [
            {
                name : "general",
                on : true,
                klass : "general-type",
                type : 'type-general'
            },
            {
                name : "text",
                on : true,
                klass : "text-type",
                type : 'type-text'
            },{
                 name : "image",
                on : true,
                klass : "image-type",
                type : 'type-image'
            }, {
                name : "color",
                on : true,
                klass : "color-type",
                type : 'type-color'
            }, {
                name : "layout",
                on : true,
                klass : "layout-type",
                type : 'type-layout'
            }
        ];

        return opts;
    }

    // @ngInject
    function AnnotateCtrl(AnnotateFactory, focus, $stateParams, AuthenticationFactory, SingProjFactory, FilterOpts, TaskFactory, $rootScope){

        _this = this;

        _this.design = {};
        _this.allDesigns = {};

        _this.openComment = false;

        _this.commentSelected = null;

        _this.newAnnotation = null;

        _this.assignTask = false;


        _this.openHead = false;
        _this.openSidebar = false;

        _this.radioColor = 'type-general';

        _this.taskAssignedTo = null;

        _this.filterOptions = FilterOpts;

        _this.updateTask = function(task){

            // toggle the value of task
            task.isComplete = !task.isComplete;

            TaskFactory.updateTask(task)
            .then(function(data){
                _this.getDesign();
                // emit the event so the task controller can update the sidebar
                $rootScope.$broadcast('updatedTask');
            }, function(error){

            });
        };

        _this.newTask = function(mark){

            var task ={};

            // bind values to task objects
            task.designId = $stateParams.design_id;
            task.annotationId = mark._id;
            task.action = mark.body;
            task.assignedTo = _this.taskAssignedTo;

            // create tasks and reload page
            TaskFactory.newTask(task)
                .then(function(data){
                    _this.getDesign();
                    _this.assignTask = false;
                    // force the task-bar to update
                    $rootScope.$broadcast('updatedTask');
                }, function(error){

                });
        };

        /*
         * toggle header class to expand header
         */
        _this.toggleHeader = function () {

            if(_this.openSidebar == true && _this.openHead == false){
                _this.openHead = true;
                _this.openSidebar = false;
            }
            else{
                _this.openHead = !_this.openHead;
            }
        };

        /*
         * toggle sidebar class to expand taskbar
         */
        _this.toggleTaskBar = function () {

            if(_this.openHead == true && _this.openSidebar == false){
                _this.openHead = false
                _this.openSidebar = true;
            }
            else{
                _this.openSidebar = !_this.openSidebar;
            }
        };

        /**
         * get design thumbnail for images
         *
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        _this.getAllDesigns = function (id) {
            var opts = {
                fields: '?fields=designs,name'
            };

            SingProjFactory
            .getProject(id, opts.fields)
            .then(function(data){
                _this.allDesigns = data;
            }, function(error){
                _this.allDesigns = {};
            });
        };

        _this.getDesign = function(){
            AnnotateFactory
            .getDesign($stateParams.design_id)
            .then(function(data){
                _this.design = data;
                _this.getAllDesigns(data.project._id);

                // then call update coords
                }, function(error){
                _this.design = {};
            });
        }

        _this.annotate = function(e) {

            // ensures comment closes when open and click on canvas
            if(_this.commentSelected != null) {
                _this.openComment = false;
                _this.commentSelected = null;
                return;
            }

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

        _this.commentOpen = function () {
            return _this.openComment;
        }

        _this.checkCoords = function (coord, value) {
            return coord > value;
        }

        _this.addAnnotation = function(annotation) {

            // bind the color type to the new annotation
            annotation.type = _this.radioColor;

            console.log(annotation);

            AnnotateFactory
                .addAnnotation(annotation, $stateParams.design_id)
                .then(function(data){
                    _this.newAnnotation = null;
                    _this.getDesign();
                    _this.assignTask = false;

                    // reset to default color
                    _this.radioColor = 'type-general';

                    // if the annotation includes a task
                    // update the task list
                    if (annotation.assignedTo) {
                        $rootScope.$broadcast('updatedTask');
                    }
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

            console.log('working');

            AnnotateFactory
            .addComment(comment, $stateParams.design_id, annotation._id)
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
            return id === $stateParams.design_id;
        };

        _this.isOwner = AuthenticationFactory.isOwner;

        _this.getDesign();

    }

    AnnotateCtrl.$inject = ['AnnotateFactory', 'focus', '$stateParams', 'AuthenticationFactory', 'SingProjFactory', 'FilterOpts', 'TaskFactory', '$rootScope'];

    function getMouse(e, targ) {

        var target = {};

        if (targ) {
            target = targ[0].getBoundingClientRect();
        } else {
            target = e.target.getBoundingClientRect();
        }

        return {
            x: e.clientX - target.left,
            y: e.clientY - target.top
        };

    }

})();