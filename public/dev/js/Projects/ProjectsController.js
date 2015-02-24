(function(){

    angular.module('coapp')
    .controller('ProjectsController', ProjController)
    .controller('ProjectModalController', ProjectModalController);

    /**
     * @ngInject
     */
    //projFactory is project service for http requests, projFactory methods can now be called
    //pass in controller dependencies, projectFactory, scope and AuthenticationFactory
    function ProjController(ProjFactory, $scope, AuthenticationFactory){

        var _this = this;
        //create projects array to hold data retrived from getProjectsAll method
        _this.projects = [];

        //get all projects in the database
        _this.getProjectsAll = function(){
            //use the project factroy to make http request
            ProjFactory.getProjects()
                //when returned if successfull set the returned data to the projects array
                .then(function(data){
                    _this.projects = data;
                }, function(error){
                    _this.Projects = {};
                }
            );

        }//end of getAll

        //get all projects when loaded
        _this.getProjectsAll();

        //check if the current user is the owner 
        _this.isOwner = AuthenticationFactory.isOwner;
        
        // listen for event and load page
        $scope.$on('project-change', function(e){
            _this.getProjectsAll();
        });

    }
    //inject dependencies
    ProjController.$inject = ["ProjFactory", '$scope', 'AuthenticationFactory'];

    /**
     * @ngInject
     */
    function ProjectModalController ($scope, $modalInstance, object, ProjFactory, $rootScope, $window, alertService) {

        // store collaborators in an array
        $scope.collaborators = [];
        //create blank project object to store a new project
        $scope.project = {};

        $scope.alertService = alertService;

        // expose object to modal scope
        $scope.object = object;

        // if object ID defined get project details for update modal
        if (object.id) {
            //call getProject from the projectFactory
            ProjFactory.getProject(object.id)
                .then(function(data){
                    //set the project object to the returned data
                    $scope.project = data;
                    var userId = $window.localStorage.user;
                    // push all users except logged in user
                    angular.forEach(data.collaborators, function(user) {
                        if (userId !== user._id) {
                            $scope.collaborators.push(user);
                        }
                    });
                    $scope.project.collaborators = null;
                });
        }
        //close modal
        $scope.ok = function(){
            $modalInstance.close();
        };

        /**
         * close modal
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        /**
         * add new project and a list of collaborators on the project
         * @param {[type]} project [description]
         */
        $scope.addProject = function (form, valid, project) {
            if(!valid){
                return false;
            }
            addCollaborators(project);
            //call addProject form the projectFactory passing in a project object
            ProjFactory.addProject(project)
                .then(function(data){
                    // closes modal if project added
                    $modalInstance.dismiss('cancel');
                    //Broadcasts out, for a listener to listen for
                    $rootScope.$broadcast('project-change');
                }, function(error){
                    // handle alerts here
                    $scope.alertService.setAlert(error.response.message);
                    // reset name of project
                    $scope.project.name = null;
                    //reset the form 
                    form.$setUntouched();
                    form.$setPristine();

                });

        };

        /**
         * delete project and all its assets based on id
         * @param  {int} id :: id of project
         */
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

        /**
         * remove user from collaborator list
         * @param  {int} $index :: index of user in list
         */
        $scope.removeCollaborator = function ($index) {
            $scope.collaborators.splice($index, 1);
        }
        /**
         * search the db for users by name
         * @param  {String} val :: search query
         * @return {Promise}    :: return search service for directive to use
         */
        $scope.searchUsers = function (val) {
            var ids = [];

            // loop over every collaborator and push there id to a seperate array
            angular.forEach($scope.collaborators, function(user) {
                ids.push(user._id);
            })
            // return service promise
            return ProjFactory.searchUsers(val, ids.join(','));
        }

        /**
         * push selected user to an array of collaborators
         * @param  {Object} $item  :: user object
         * @param  {Object} $model :: user id
         * @param  {Object} $label :: user name
         */
        $scope.onSelect = function ($item, $model, $label) {
            $scope.collaborators.push($item);
            $scope.project.collaborators = null; // clear form
        };

        /**
         * update project
         * @param  {Object} project :: project to update
         */
        $scope.updateProject = function (form, valid, project) {
            if(!valid){
                return false;
            }
            addCollaborators(project);

            ProjFactory.updateProject(project)
                .then(function(){
                    $modalInstance.dismiss('cancel');
                    $rootScope.$broadcast('project-change');
                }, function(error){
                    $scope.alertService.setAlert(error.response.message);
                    // reset name of project
                    $scope.project.name = null;
                    //reset the form
                    form.$setUntouched();
                    form.$setPristine();

                });
        }

        /**
         * add collaborators to the project object
         * just before it gets sent to the API
         * @param {Object} project
         */
        function addCollaborators (project) {
            //create an array to hold collaborators
            project.collaborators = [];
            // push collaborators on to project
            if($scope.collaborators.length) {
                angular.forEach($scope.collaborators, function(user) {
                    project.collaborators.push(user._id);
                })
            }
        }
    }
    //inject dependencies into the controller
    ProjectModalController.$inject = ["$scope", "$modalInstance", "object", "ProjFactory", "$rootScope", "$window", "alertService"];
})();