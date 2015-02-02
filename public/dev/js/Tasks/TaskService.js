(function(){
	'use strict';

	angular.module('coapp')
    .factory('TaskFactory', TaskFactory);

    //creates factory to send http requests to the server
    function TaskFactory($http, $q){

        //create task object to add methods to
    	var task = {};

        //gets all tasks api/tasks
    	task.getTasks = function(){
                //create the promise object
    		  var defer = $q.defer();

    		  $http.get('api/tasks')
              //if successful
    		  .success(function(data){
    		  	defer.resolve(data);
    		  })
              //if there is an error
    		  .error(function(err, status){
    		  	defer.reject(err);
    		  })
    		  return defer.promise;

    	};

        //update task
        task.updateTask = function(task){
            $http.put('api/tasks')
            .success(function(data){
                defer.resolve(data);
            })
            .error(function(err, status){
                defer.reject(err);
            })
            return defer.promise;
        }

        //return the task object with methods that can be called from the controller
    	return task;

    };

    TaskFactory.$inject=['$http', '$q'];
})();