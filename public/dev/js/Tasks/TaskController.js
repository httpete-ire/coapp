(function(){

    angular.module('coapp')
    .controller('TasksController', TasksController);

    //sets up controller to handle task data

    function TasksController(TaskFactory, $stateParams, $scope, TaskProject){
        //set this, to avoid scope
        var _this = this;
        //
        _this.allUserProjectsWithTasks = [];
        _this.designsWithTasks = [];
        _this.ownerTasks = [];

        _this.usersTasks = [];

        // listen for the annotation controller to complete a task
        $scope.$on('updatedTask', function (e) {
            _this.getTasks();
        });

        _this.openSidebar = false;

        _this.currectTasks = null;


        _this.toggleTaskBar = function () {
            _this.openSidebar = !_this.openSidebar;
        };
        //get tasks function calls the getTasks function from the factory
        /**
         * fetch the tasks from the db
         * @return {[type]} [description]
         */
        _this.getTasks = function(id){

            if (_this.currectTasks === id) {
                return;
            }

            var tasklistPage = (id !== undefined);

            var _id = id || $stateParams.design_id;

            TaskFactory.getTasks(_id)
                .then(function(data){

                    if(data.length === 1) {
                        _this.ownerTasks = data;
                    } else {
                        _this.usersTasks = data;
                    }

                    if(tasklistPage) {
                        _this.openSidebar = true;
                         _this.currectTasks = _id;
                    }

                }, function(error){
                    _this.tasks = {};
                });
        };

        //get user projects that contain tasks
        //left panel
        _this.getUserProjectsWithTasks = function(){

            TaskFactory.getUserProjectsWithTasks()

            .then(function(data){
                _this.allUserProjectsWithTasks = data;

            }, function(error){
                _this.allUserProjectsWithTasks = {};
            });
        };


        //get designs with user tasks
        //center panel
        _this.getDesignsWithTasks = function(){

            var id = TaskProject.getId();

            _this.openSidebar = false;

            TaskFactory.getDesignsWithTasks(id)
                .then(function(data){
                    _this.designsWithTasks = data;
            }), function(error){
                    _this.designsWithTasks = {}
            };
        };


        _this.updateTask = function(task){

            // toggle the value of task
            task.isComplete = !task.isComplete;

            TaskFactory.updateTask(task)
            .then(function(data){
                // successful updated

            }, function(error){

            });
        };
    };


    TasksController.$inject = ["TaskFactory", "$stateParams", "$scope", "TaskProject"];

})();