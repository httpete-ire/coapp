(function(){

    angular.module('coapp')
    .controller('SingleProjectController', SingProjCtrl)
    .controller('SingleProjectModalController', SingProjModalCtrl);


    //set up controller with dependencies, $stateParams retreives the current url
    function SingProjCtrl(SingProjFactory, $scope, $upload, $stateParams, AuthenticationFactory){

       var _this = this;
        //set up object to hold the data about a single project
        _this.project = {};

        // set collabartor list to an empty string when the page loads
        // when the database returns its results we then populate the list
        _this.collaborators = 'test';

        //get all the designs for a single project
        _this.getProjectDesigns=function(){
            //call getProjects from the singleProjectService, passing in the id from the stateParams
            SingProjFactory.getProject($stateParams.project_id)
                .then(function(data){
                    // on success set the project object to the data retreived
                    _this.project = data;
                    _this.setCollaborators(_this.project.collaborators);
                }, function(error){
                    // error
                    _this.project = {};
                });
        }

        //??
        _this.getActivtyIcon = function (activityType) {
            var klass = '';

            switch (activityType) {
                case 'new design':
                    klass = 'fa-file-image-o';
                    break;
                case 'new task':
                    klass = 'fa-check-square-o';
                    break;
                case 'new annotation':
                    klass = 'fa-pencil-square-o';
                    break;
                case 'task complete':
                    klass = 'fa-check';
                    break;
                case 'new project':
                    klass = 'fa-plus';
                    break;
            }

            return klass;
        };

        _this.setCollaborators = function (users) {

            var userList = '';

            var owner = false;

            for (var i = 0, length = users.length; i < length; i++) {

                // concatenate username to string
                userList += users[i].username;

                // tag the owner of the project
                if(!owner && _this.project.owner === users[i]._id) {
                    userList += ' (owner)';
                    owner = true;
                }

                // for every user except the last add a comma to the name
                if( i !== (length - 1 ) ) {
                    userList += ', ';
                }

            }

            _this.collaborators = userList;
        };

        //upload a file to the server
        _this.onFileSelect = function($files) {
            //get thr first file uploaded
            var file = $files[0];
            //upload a file to the current project using the id from the stateParams
            $scope.upload = SingProjFactory
                            .upload(file, $stateParams.project_id)
                            .then(function(data){
                                //when done update the designs view
                                _this.getProjectDesigns();
                            });

        };

        //
        _this.getProjectDesigns();

        _this.isOwner = AuthenticationFactory.isOwner;

        $scope.$on('design-change', function(e){
            _this.getProjectDesigns();
        });
    }
    //inject dependencies, $upload for file upload
    SingProjCtrl.$inject = ["SingProjFactory",'$scope', '$upload', '$stateParams', 'AuthenticationFactory'];

    //modal controller, used for deleting a design
    function SingProjModalCtrl ($scope, $modalInstance, object, SingProjFactory, $rootScope, $window) {


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