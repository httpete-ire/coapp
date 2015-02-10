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

            var defer = $q.defer();

            var path = 'api/designs/'+ task.designId+'/annotations/'+ task.annotationId+'/tasks';

            $http.post(path, task)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;
        };

        /**
         * get a list of tasks related to the design and user
         *
         * @return {Promise}
         */
        task.getTasks = function(id){

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