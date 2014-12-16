(function () {
    'use strict';

    coapp.factory('SingProjFactory', singleProjectFactory);

    function singleProjectFactory ($http, $q, $routeParams, $upload) {
        //epmty object to be returned when methods are added
        var SingProj = {};

        SingProj.getProject = function(){

            var defer = $q.defer();

            $http.get('/api/projects/'+$routeParams.project_id+'?fields=designs,name')
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

            var url = '/api/projects/'+ $routeParams.project_id + '/designs';

            var defer = $q.defer();


            $upload.upload({
                url: url,
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