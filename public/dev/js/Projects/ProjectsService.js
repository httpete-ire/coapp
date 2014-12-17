var coapp = angular.module('coapp');

    coapp.factory('ProjFactory', ["$http", "$q", function($http, $q ){

            //epmty object to be returned when methods are added
            var proj = {};

            var getProjectsPath = '/api/projects?fields=name,desc,thumbnail,designCount,created';
            var addProjectPath = '/api/projects';
            var deleteProjectPath = '/api/projects/';


            //get projects from server
            proj.getProjects = function(){
                //set up the promise object
                var defer = $q.defer();
                //get request to server for projects
                $http.get(getProjectsPath)
                    //calback if succesfull or an error
                    .success(function(data){
                            defer.resolve(data);
                    })
                    .error(function(err, status){
                        defer.reject(err);
                    })
                    //return the promise object
                    return defer.promise;
            };


            //add a project to server with path and new project from controller
            proj.addProject = function(project){

                var defer = $q.defer();
                //post a project to server, with project created from form
                $http.post(addProjectPath, project)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(err, status){
                       defer.reject(err);
                    })

                    return defer.promise;
                };
            //delete a project by the id passed from the controller
            proj.deleteProject = function(projectid){
               var defer = $q.defer();

                $http.delete(deleteProjectPath+projectid)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(err, status){
                       defer.reject(err);
                    })

                    return defer.promise;
                };

            //return the proj object with: deleteProject, addProject, getProjects methods available for the controller to use
            return proj;
        } ]);