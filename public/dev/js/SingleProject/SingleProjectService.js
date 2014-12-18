(function () {
    'use strict';

    coapp.factory('SingProjFactory', singleProjectFactory);

    function singleProjectFactory ($http, $q, $routeParams, $upload) {
        //epmty object to be returned when methods are added
        var SingProj = {};

        var paths = {
            api: '/api/projects/',
            fields: '?fields=designs,name',
            id: $routeParams.project_id
        };

        var getSingleProjectPath = paths.api + paths.id + paths.fields;

        var uploadUrl = paths.api + paths.id + '/designs';

        SingProj.getProject = function(){

            var defer = $q.defer();

            $http.get(getSingleProjectPath)
                //calback if succesfull or an error
                .success(function(data){
                        defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;

        };

        SingProj.upload = function(file) {

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
