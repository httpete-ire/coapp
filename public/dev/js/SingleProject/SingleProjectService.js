(function () {
    'use strict';

    angular.module('coapp')
    .factory('SingProjFactory', singleProjectFactory);

    function singleProjectFactory ($http, $q, $routeParams, $upload) {
        //epmty object to be returned when methods are added
        var SingProj = {};

        var paths = {
            api: '/api/projects/',
            fields: '?fields=designs,name,owner'
        };

        SingProj.getProject = function(projectid){

            var defer = $q.defer();

            $http.get(paths.api + projectid + paths.fields)
                //calback if succesfull or an error
                .success(function(data){
                        defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;

        };

        SingProj.deleteDesign = function(designid){
            var defer = $q.defer();

            $http.delete('/api/designs/' + designid)

            .success(function(data){
                        defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;
        };

        SingProj.upload = function(file, projectid) {

            var uploadUrl = paths.api + projectid + '/designs';

            var defer = $q.defer();

            $upload.upload({
                url: uploadUrl,
                file: file
            }).success(function(data, status, headers, config) {
                defer.resolve(data);
            }).error(function(err, status){
                    defer.reject(err);
            });

            return defer.promise;

        };

        return SingProj;
    }

    singleProjectFactory.$inject = ['$http', '$q', '$routeParams', '$upload'];

})();
