(function () {
    'use strict';

    angular.module('coapp')
    .factory('AnnotateFactory', AnnotateFactory);

    // @ngInject
    function AnnotateFactory ($http, $q, $stateParams) {
        //epmty object to be returned when methods are added
        var SingDesign = {};
        //api path for http calls
        var Path = '/api/designs/';

        //get a design using the design id passed from the controller
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

        //add an annotation using the anno object passed from the controller, and assign it to the
        //design passed in
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

        //update an annotations x and y position, called form the draggable directive
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

        //add a comment to a design
        SingDesign.addComment = function (comment, designId, annotationId) {

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
    AnnotateFactory.$inject = ["$http", "$q", "$stateParams"];

})();
