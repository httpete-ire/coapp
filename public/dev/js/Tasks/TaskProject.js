(function(){

    angular.module('coapp')
    .factory('TaskProject', TaskProject);

    function TaskProject () {

        var TaskProject = {
            _id: null
        };

        TaskProject.setId = function (id) {
            TaskProject._id = id;
        }

        TaskProject.getId = function () {
            return TaskProject._id;
        }

        TaskProject.reset = function () {
            return TaskProject._id = null;
        };

        return TaskProject;

    }

})();