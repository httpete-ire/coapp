(function(){

	angular.module('coapp')
    .controller('TasksController', TasksController);


    function TasksController(TaskFactory){

    	var _this = this;

    	_this.tasks = {};

    	_this.getTasks = function(){
    		TaskFactory.getTasks()
    		.then(function(data){
    			_this.tasks = data;
    		}, function(error){
    			_this.tasks = {};
    		})
    	};

        _this.updateTask = function(task){
            TaskFactory.updateTask()
            .then(function(data){

            }, function(error){

            })
        };

    	_this.getTasks();
    };

    TasksController.$inject = ["TaskFactory"];

})();