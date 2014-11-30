(function () {
    'use strict';

    var coapp = angular.module('coapp');

    coapp.controller('projectController', function($http){
        var _this = this;

        $http.get('/api/project')
            .success(function(data){
                _this.Projects = data;
            });


    });

})();