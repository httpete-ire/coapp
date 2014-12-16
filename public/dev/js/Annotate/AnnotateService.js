(function () {
    'use strict';

    coapp.factory('AnnotateFactory', AnnotateFactory);

    function AnnotateFactory ($http, $q, $routeParams) {
        //epmty object to be returned when methods are added
        var SingDesign = {};

        SingDesign.getDesign = function(){

            var defer = $q.defer();

            $http.get('/api/designs/'+$routeParams.design_id)
                //calback if succesfull or an error
                .success(function(data){

                        defer.resolve(data);
                })
                .error(function(err, status){
                    defer.reject(err);
                });

            return defer.promise;

        };



        return SingDesign;
    }

    AnnotateFactory.$inject = ['$http', '$q', '$routeParams'];

})();