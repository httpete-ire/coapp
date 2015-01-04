(function(){

    angular.module('coapp')
    .controller('SingleProjectController', SingProjCtrl);



    function SingProjCtrl(SingProjFactory, $scope, $upload, $routeParams){

        _this = this;
        _this.project = {};

        _this.getProjectDesigns=function(){

            SingProjFactory.getProject($routeParams.project_id)

            .then(function(data){
                 _this.project = data;
                    }, function(error){
                        _this.project = {};

                    });
        }

        _this.onFileSelect = function($files) {

            var file = $files[0];

            $scope.upload = SingProjFactory
                            .upload(file, $routeParams.project_id)
                            .then(function(data){
                                _this.getProjectDesigns();
                            });

        };

         _this.getProjectDesigns();

    }

    SingProjCtrl.$inject = ["SingProjFactory",'$scope', '$upload', '$routeParams'];

})();