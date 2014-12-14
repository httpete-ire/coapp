(function(){

angular.module('coapp')
.controller('ProjectsController', ProjController);
/**
 * @ngInject
 */
//projFactory is project service for http requests, projFactory methods can now be called
function ProjController(ProjFactory, $modal){

    var _this = this;

    _this.projects = [];

    var modalInstance = 'test';



    _this.getProjectsAll = function(){
        //projFactory method getProjects()
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


    _this.open = function (size) {
        // _this.openModal = function ($modal){

        modalInstance = $modal.open({
            templateUrl: '/dev/js/views/Projects/addProjectModal.html'
        });

    }


    //get all projects whe loaded
    _this.getProjectsAll();

}
ProjController.$inject = ["ProjFactory",'$modal'];


})();