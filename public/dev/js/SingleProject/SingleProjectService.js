(function () {
    'use strict';

    angular.module('coapp')
    .factory('SingProjFactory', singleProjectFactory);

    //single project factory, handles http requests to the server
    function singleProjectFactory ($http, $q, $stateParams, $upload) {
        //epmty object to be returned when methods are added
        var SingProj = {};

        //http paths stored in an object used for methods
        var paths = {
            api: '/api/projects/',
            fields: '?fields=designs,name,owner,recentActivities,desc,updated,collaborators'
        };

        //get a single project based on the project id
        SingProj.getProject = function(projectid, opts){

            var fields = opts || paths.fields;
            //set up promise object instance
            var defer = $q.defer();

            //http request pasing in the path, the id and the query
            $http.get(paths.api + projectid + fields)
                //calback if succesfull or an error
                .success(function(data){
                        defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            //return promise object
            return defer.promise;

        };

        //delete a design based on the design Id
        SingProj.deleteDesign = function(designid){
            //set up project object
            var defer = $q.defer();

            //http to delete a design given the design id
            $http.delete('/api/designs/' + designid)
                .success(function(data){
                        defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;
        };

        //upload a file(image) based on the project id
        SingProj.upload = function(file, projectid) {
            var uploadUrl = paths.api + projectid + '/designs';
            //set up defer instance
            var defer = $q.defer();

            $upload.upload({
                url: uploadUrl,
                file: file
            })
                 .success(function(data, status, headers, config) {
                    defer.resolve(data);
                }).error(function(err, status){
                        defer.reject(err);
                });

            return defer.promise;

        };

        //return the SingProj object with attached methods
        return SingProj;
    }

    //inject dependencies, $upload used to upload an image to the server
    singleProjectFactory.$inject = ['$http', '$q', '$stateParams', '$upload'];

})();
