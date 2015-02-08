(function(){

    angular.module('coapp')
    .controller('TasksController', TasksController);

    //sets up controller to handle task data
    function TasksController(TaskFactory){
        //set this, to avoid scope
        var _this = this;


        _this.ownerTasks = [];

        _this.usersTasks = [];

        //get tasks function calls the getTasks function from the factory
        /**
         * fetch the tasks from the db
         * @return {[type]} [description]
         */
        _this.getTasks = function(){
            console.log('before call');
            TaskFactory.getTasks()
                .then(function(data){

                    if(data.length === 1) {
                        _this.ownerTasks = data;
                    } else {
                        _this.usersTasks = data;
                    }

                    console.log(_this.ownerTasks);

                    console.log(_this.usersTasks);

                }, function(error){
                    _this.tasks = {};
                });
        };

        _this.updateTask = function(task){

            // toggle the value of task
            task.isComplete = !task.isComplete;

            TaskFactory.updateTask(task)
            .then(function(data){

            }, function(error){

            });
        };

        _this.getTasks();
    };

    TasksController.$inject = ["TaskFactory"];

})();