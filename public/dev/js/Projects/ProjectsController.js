(function(){

    angular.module('coapp')
    .controller('ProjectsController', ProjController)
    .controller('ProjectModalController', ProjectModalController);

    /**
     * @ngInject
     */
    //projFactory is project service for http requests, projFactory methods can now be called
    function ProjController(ProjFactory, $scope, AuthenticationFactory){

        var _this = this;

        _this.projects = [];

        _this.getProjectsAll = function(){

            ProjFactory.getProjects()
                .then(function(data){
                    _this.projects = data;
                }, function(error){
                    _this.Projects = {};

                }
            );

        }//end of getAll

        //get all projects when loaded
        _this.getProjectsAll();

        _this.isOwner = AuthenticationFactory.isOwner;

        // listen for event and load page
        $scope.$on('project-change', function(e){
            _this.getProjectsAll();
        });

    }
    ProjController.$inject = ["ProjFactory", '$scope', 'AuthenticationFactory'];

    /**
     * @ngInject
     */
    function ProjectModalController ($scope, $modalInstance, object, ProjFactory, $rootScope, $window, alertService) {

        // store collaborators in an array
        $scope.collaborators = [];

        $scope.project = {};

        $scope.alertService = alertService;

        // expose object to modal scope
        $scope.object = object;

        // if object ID defined get project details for update modal
        if (object.id) {
            ProjFactory.getProject(object.id)
            .then(function(data){

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
        $scope.addProject = function (project) {

            addCollaborators(project);

            ProjFactory.addProject(project)
            .then(function(data){
                // closes modal if project added
                $modalInstance.dismiss('cancel');
                //Broadcasts out, for a listener to listen for
                $rootScope.$broadcast('project-change');
                $scope.project = null;//to set the form back to blank
            }, function(error){
                // handle alerts here
                $scope.alertService.setAlert(error.response.message);
                $scope.alertService.sleep(3500);

                // reset name of project
                $scope.project.name = null;

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
        $scope.updateProject = function (project) {
            addCollaborators(project);

            ProjFactory.updateProject(project)
            .then(function(){

                $modalInstance.dismiss('cancel');
                $rootScope.$broadcast('project-change');

            }, function(error){

                $scope.alertService.setAlert(error.response.message);
                $scope.alertService.sleep(3500);

                // reset name of project
                $scope.project.name = null;

            });
        }

        /**
         * add collaborators to the project object
         * just before it gets sent to the API
         * @param {Object} project
         */
        function addCollaborators (project) {

            project.collaborators = [];

            // push collaborators on to project
            if($scope.collaborators.length) {
                angular.forEach($scope.collaborators, function(user) {
                    project.collaborators.push(user._id);
                })
            }

        }

    }

    ProjectModalController.$inject = ["$scope", "$modalInstance", "object", "ProjFactory", "$rootScope", "$window", "alertService"];


})();