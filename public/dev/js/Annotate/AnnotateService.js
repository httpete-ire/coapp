(function () {
    'use strict';

    angular.module('coapp')
    .factory('AnnotateFactory', AnnotateFactory);

    // @ngInject
    function AnnotateFactory ($http, $q, $routeParams) {
        //epmty object to be returned when methods are added
        var SingDesign = {};

        var Path = '/api/designs/';
        var addAnnotationPath = Path+$routeParams.design_id+"/annotations";

        SingDesign.getDesign = function(design_id){

            var defer = $q.defer();

            $http.get(Path + design_id, {
                    params: {
                        fields: 'name,project,annotations,img'
                    }
                })
                //calback if succesfull or an error
                .success(function(data){
                        defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;

        };

        SingDesign.addAnnotation = function(anno){

            var defer = $q.defer();

            $http.post(addAnnotationPath, anno)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                })

            return defer.promise;

        };




        return SingDesign;
    }
    AnnotateFactory.$inject = ["$http", "$q", "$routeParams"];

})();
