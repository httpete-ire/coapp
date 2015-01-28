(function(){
	'use strict';

	angular.module('coapp')
    .factory('TaskFactory', TaskFactory);


    function TaskFactory($http, $q){

    	var task = {};


    	task.getTasks = function(){

    		  var defer = $q.defer();

    		  $http.get('api/tasks')
    		  .success(function(data){
    		  	defer.resolve(data);
    		  })
    		  .error(function(err, status){
    		  	defer.reject(err);
    		  })
    		  return defer.promise;

    	};

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

    	return task;

    };

    TaskFactory.$inject=['$http', '$q'];
})();