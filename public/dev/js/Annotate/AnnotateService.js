(function () {
    'use strict';

    angular.module('coapp')
    .factory('AnnotateFactory', AnnotateFactory);

    // @ngInject
    function AnnotateFactory ($http, $q, $routeParams) {
        //epmty object to be returned when methods are added
        var SingDesign = {};

        var Path = '/api/designs/';


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

        SingDesign.addAnnotation = function(anno, designId){

            var addAnnotationPath = Path + designId + "/annotations";

            var defer = $q.defer();

            $http.post(addAnnotationPath, anno)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;

        };

        SingDesign.updateAnnotation = function (anno, designid) {

            var annotationPath = Path + designid + "/annotations/" + anno._id;

            var defer = $q.defer();

            $http.put(annotationPath, anno)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;
        }

        SingDesign.addComment = function (comment, designId, annotationId) {

            // api/design/:designid/annotations/:annotationid/comments

            var defer = $q.defer();

            var commentPath = Path + designId + '/annotations/' + annotationId + '/comments';

            $http.post(commentPath, comment)
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (err, status){
                    defer.reject(err);
                });

            return defer.promise;

        };

        return SingDesign;
    }
    AnnotateFactory.$inject = ["$http", "$q", "$routeParams"];

})();
