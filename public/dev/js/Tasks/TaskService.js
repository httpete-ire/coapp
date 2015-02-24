(function(){
    'use strict';

    angular.module('coapp')
    .factory('TaskFactory', TaskFactory);

    //creates factory to send http requests to the server
    function TaskFactory($http, $q){

        //create task object to add methods to
        var task = {};

        /**
         * create a new task in the DB
         *
         * @param  {Object} task
         * @return {Promise}
         */
        task.newTask = function(task){
            //set up a defer instance
            var defer = $q.defer();
            //set the path to be used for http
            var path = 'api/designs/'+ task.designId+'/annotations/'+ task.annotationId+'/tasks';
            //post request passing the path and the task from the controller
            $http.post(path, task)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;
        };


        //get projects that contain tasks
        //left panel on task view page
        task.getUserProjectsWithTasks = function(){
            var defer = $q.defer();
            var path = 'api/tasks/projects';
            //get projects that hold user tasks
            $http.get(path)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;
        };

        //get disigns of a project that the user has tasks on
        task.getDesignsWithTasks = function(id){
          var defer = $q.defer();
          var path = 'api/tasks/projects/' + id;
          //get designs for a project with a project id
          $http.get(path)
              .success(function(data){
                defer.resolve(data);
              })
              .error(function(err, status){
                defer.reject(err);
              })

          return defer.promise;
        };

        /**
         * get a list of tasks related to the design and user
         * 
         * @return {Promise}
         */
        task.getTasks = function(id){
            console.log(id);
            var defer = $q.defer();

            var path = 'api/designs/' + id + '/tasks';

            $http.get(path)
              .success(function(data){
                  defer.resolve(data);
              })
              .error(function(err, status){
                   defer.reject(err);
              });

            return defer.promise;
        };

        /**
         * update the task in the DB
         * @param  {Object} task
         * @return {Promise}
         */
        task.updateTask = function(task) {
            var defer = $q.defer();
            //put request to tasks, with the task object passed in
            $http.put('api/tasks/' + task._id, task)
              .success(function(data){
                  defer.resolve(data);
              })
              .error(function(err, status){
                  defer.reject(err);
              })
            return defer.promise;
        }

        // return the task object with methods
        // that can be called from the controller
        return task;
    };

    TaskFactory.$inject=['$http', '$q'];
})();