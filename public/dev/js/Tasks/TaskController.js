(function(){

    angular.module('coapp')
    .controller('TasksController', TasksController);

    //sets up controller to handle task data
    function TasksController(TaskFactory){
        //set this, to avoid scope
        var _this = this;

        //creat an empty object which will hold our data about tasks
        _this.tasks = {};

        //get tasks function calls the getTasks function from the factory
        _this.getTasks = function(){
            TaskFactory.getTasks()
            .then(function(data){
                _this.tasks = data;
            }, function(error){
                _this.tasks = {};
            })
        };

        _this.updateTask = function(task){

            console.log('in the task ctrl');

            // toggle the value of task
            task.isComplete = !task.isComplete;

            TaskFactory.updateTask(task)
            .then(function(data){

            }, function(error){

            });
        };

        

        

        // _this.getTasks();
    };

    TasksController.$inject = ["TaskFactory"];

})();