(function(){

angular.module('coapp')
.controller('ProjectsController', ProjController)
.controller('ProjectModalController', ProjectModalController);

/**
 * @ngInject
 */
//projFactory is project service for http requests, projFactory methods can now be called
function ProjController(ProjFactory, $scope){

    var _this = this;

    _this.projects = [];

    _this.getProjectsAll = function(){
        ProjFactory.getProjects()
            .then(function(data){
                _this.projects = data;
            }, function(error){
                        _this.Projects = {};

                    });


    }//end of getAll

    //get all projects when loaded
    _this.getProjectsAll();

    // listen for event and load page
    $scope.$on('project-change', function(e){
        _this.getProjectsAll();
    });

}
ProjController.$inject = ["ProjFactory", '$scope'];

/**
 * @ngInject
 */
function ProjectModalController ($scope, $modalInstance, object, ProjFactory, $rootScope) {


    // todo
    // alerts in modals

    $scope.object = object;

    $scope.ok = function(){
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addProject = function (project) {

        ProjFactory.addProject(project)
        .then(function(data){
        // closes modal if project added
            $modalInstance.dismiss('cancel');
            //Broadcasts out, for a listener to listen for
            $rootScope.$broadcast('project-change');
            $scope.project = null;//to set the form back to blank
        }, function(error){
                console.log(error);
            });

    };

    $scope.deleteProject = function(id){
        ProjFactory.deleteProject(id)
        .then(function(data){
            $modalInstance.dismiss('cancel');
            $rootScope.$broadcast('project-change');
        }, function(error){
                // alert boxes
            }
        );
    };

    $scope.users = [{name:'Alex'}, {name: 'Pete'}, {name: 'Sue'}, {name: 'Sam'}];

}
ProjectModalController.$inject = ["$scope", "$modalInstance", "object", "ProjFactory", "$rootScope"];

})();