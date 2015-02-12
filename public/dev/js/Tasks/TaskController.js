(function(){

    angular.module('coapp')
    .controller('TasksController', TasksController);

    //sets up controller to handle task data
    function TasksController(TaskFactory, $stateParams){
        //set this, to avoid scope
        var _this = this;
         
        _this.allUserTasks = [];
        _this.ownerTasks = [];

        _this.usersTasks = [];

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
            console.log('adfadsfasdfas chelsea');
            TaskFactory.getUserTasks()
            .then(function(data){
                _this.allUserTasks = data;
            }, function(error){
                _this.allUserTasks = {};
            });
        };

        

        _this.updateTask = function(task){

            console.log('upading');

            // toggle the value of task
            task.isComplete = !task.isComplete;

            TaskFactory.updateTask(task)
            .then(function(data){

            }, function(error){

            });
        };
    };

    TasksController.$inject = ["TaskFactory", "$stateParams"];

})();