(function(){

    angular.module('coapp')
    .controller('SingleProjectController', SingProjCtrl)
    .controller('SingleProjectModalController', SingProjModalCtrl);



    function SingProjCtrl(SingProjFactory, $scope, $upload, $routeParams, AuthenticationFactory){

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

        // _this.deleteDesign = function(id){
        //     SingProjFactory.deleteDesign(id)
        //     .then(function(data){
        //         _this.getProjectDesigns();
        //             }, function(error){
        //                 // _this.project = {};

        //             });
        // }

        _this.onFileSelect = function($files) {

            var file = $files[0];

            $scope.upload = SingProjFactory
                            .upload(file, $routeParams.project_id)
                            .then(function(data){
                                _this.getProjectDesigns();
                            });

        };

         _this.getProjectDesigns();

          _this.isOwner = AuthenticationFactory.isOwner;

          $scope.$on('design-change', function(e){
            _this.getProjectDesigns();
        });
    }

    SingProjCtrl.$inject = ["SingProjFactory",'$scope', '$upload', '$routeParams', 'AuthenticationFactory'];


    function SingProjModalCtrl ($scope, $modalInstance, object, SingProjFactory, $rootScope, $window) {


        $scope.design = {};

        // expose object to modal scope
        $scope.object = object;



        $scope.ok = function(){
            $modalInstance.close();
        };

        /**
         * close modal
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };






        $scope.deleteDesign = function(id){
            SingProjFactory.deleteDesign(id)
            .then(function(data){
                $modalInstance.dismiss('cancel');
                $rootScope.$broadcast('design-change');
                    }, function(error){
                        // _this.project = {};

                    });
        }









    }

    SingProjModalCtrl.$inject = ["$scope", "$modalInstance", "object", "SingProjFactory", "$rootScope", "$window"];

})();