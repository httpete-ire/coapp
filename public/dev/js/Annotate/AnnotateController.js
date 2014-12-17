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
                // console.log(data.annotations);
                 _this.design = data;
                    console.log(_this.design.annotations);
                    }, function(error){
                        _this.design = {};

                    });
        }

        _this.annotate = function(e) {
            var mouse = getMouse(e);

            console.log(mouse);
        };






         _this.getDesign();

    }

    function getMouse(e) {
        var target = e.target.getBoundingClientRect();

        return {
            x: e.clientX - target.left,
            y: e.clientY - target.top
        };

    }

    AnnotateCtrl.$inject = ["AnnotateFactory",'$scope'];

})();