(function(){

    angular.module('coapp')
    .controller('SingleProjectController', SingProjCtrl)
    .controller('SingleProjectModalController', SingProjModalCtrl);



    function SingProjCtrl(SingProjFactory, $scope, $upload, $routeParams, AuthenticationFactory){

        _this = this;
        _this.project = {};

        // set collabartor list to an empty string when the page loads
        // when the database returns its results we then populate the list
        _this.collaborators = 'test';

        _this.getProjectDesigns=function(){

            SingProjFactory.getProject($routeParams.project_id)

            .then(function(data){
                // dsuccess
                _this.project = data;
                _this.setCollaborators(_this.project.collaborators);
            }, function(error){
                // error
                _this.project = {};
            });
        }

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