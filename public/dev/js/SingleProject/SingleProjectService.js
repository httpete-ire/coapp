var coapp = angular.module('coapp');

    coapp.factory('SingProjFactory', ["$http", "$q", "$routeParams", function($http, $q, $routeParams ){

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
                    })
// 548dfa1e5eb4153a562e3e01'

                return defer.promise;

            }


            return SingProj;

    } ]);