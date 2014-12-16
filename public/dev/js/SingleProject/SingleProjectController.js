(function(){


    angular.module('coapp')
    .controller('SingleProjectController', SingProjCtrl);



    function SingProjCtrl(SingProjFactory, $scope, $upload){

        _this = this;
        _this.project = {};

        _this.getProjectDesigns=function(){
            // console.log(SingProjFactory);
            SingProjFactory.getProject()

            .then(function(data){
                console.log("returned data: ");
                console.log(data);
                 _this.project = data;

                    }, function(error){
                        _this.project = {};

                    });
        }

        _this.onFileSelect = function($files) {

            var file = $files[0];

            $scope.upload = SingProjFactory
                            .upload(file)
                            .then(function(data){
                                _this.getProjectDesigns();
                            });

        };

         _this.getProjectDesigns();

    }

    SingProjCtrl.$inject = ["SingProjFactory",'$scope', '$upload'];

})();