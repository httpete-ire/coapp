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
        //projFactory method getProjects()
        // console.log(projFactory)
        ProjFactory.getProjects()
            .then(function(data){
                console.log(data);
                 _this.projects = data;

                    }, function(error){
                        _this.Projects = {};

                    });


    }//end of getAll

    //get the form inputs on submit and creates project with inputs
    _this.addProject = function(project){
        //projFactory method addProject(p), takes a project as parameter
        ProjFactory.addProject(project)
            .then(function(data){
                 _this.projects = data;
                 _this.getProjectsAll();//to refresh page to get all projects
                 _this.project = null;//to set the form back to blank
                    }, function(error){
                        _this.Projects = {};

                    });

    }//end of addProject

    //gets id of project from button click, and passes the id to the service
    _this.deleteProject = function(id){
        console.log("controller " +id);
        ProjFactory.deleteProject(id)
        .then(function(data){
                 _this.projects = data;
                 _this.getProjectsAll();//to refresh page to get all projects
                    }, function(error){
                        _this.Projects = {};

                    });
    }//end of deleteProject

    _this.ok = function(){
        $modalInstance.close();
    };

    _this.cancel = function () {
        console.log('tsfdfsd');
        $modalInstance.dismiss('cancel');
    };


    //get all projects whe loaded
    _this.getProjectsAll();

    $scope.$on('project-change', function(e){
        _this.getProjectsAll();
    });

}
ProjController.$inject = ["ProjFactory", '$scope'];

/**
 * @ngInject
 */
function ProjectModalController ($scope, $modalInstance, object, ProjFactory, $rootScope) {

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

                        $rootScope.$broadcast('project-change');

                        $scope.project = null;//to set the form back to blank
                    }, function(error){
                        console.log(error);
                    });
    };

}

})();