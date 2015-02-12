(function(){

    angular.module('coapp')
    .controller('TasksController', TasksController);

    //sets up controller to handle task data
    function TasksController(TaskFactory, $stateParams, $scope){
        //set this, to avoid scope
        var _this = this;

        _this.allUserTasks = [];
        _this.ownerTasks = [];

        _this.usersTasks = [];

        // listen for the annotation controller to complete a task
        $scope.$on('updatedTask', function (e) {
            _this.getTasks();
        });

        //get tasks function calls the getTasks function from the factory
        /**
         * fetch the tasks from the db
         * @return {[type]} [description]
         */
        _this.getTasks = function(){

            TaskFactory.getTasks($stateParams.design_id)
                .then(function(data){

                    if(data.length === 1) {
                        _this.ownerTasks = data;
                    } else {
                        _this.usersTasks = data;
                    }

                }, function(error){
                    _this.tasks = {};
                });
        };


        //gets tasks for task page
        _this.getUserTasks = function(){

            TaskFactory.getUserTasks()
            .then(function(data){
                _this.allUserTasks = data;
            }, function(error){
                _this.allUserTasks = {};
            });
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

    TasksController.$inject = ["TaskFactory", "$stateParams", "$scope"];

})();