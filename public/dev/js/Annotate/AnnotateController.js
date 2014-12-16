(function(){


    angular.module('coapp')
    .controller('AnnotateController', AnnotateCtrl);



    function AnnotateCtrl(AnnotateFactory, $scope){

        _this = this;
        _this.design = {};

        _this.getDesign=function(){
            // console.log(SingProjFactory);
            AnnotateFactory.getDesign()

            .then(function(data){
                console.log("returned data: ");
                console.log(data);
                 _this.design = data;

                    }, function(error){
                        _this.design = {};

                    });
        }



         _this.getDesign();

    }

    AnnotateCtrl.$inject = ["AnnotateFactory",'$scope'];

})();