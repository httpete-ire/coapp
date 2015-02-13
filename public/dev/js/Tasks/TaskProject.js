(function(){

    angular.module('coapp')
    .factory('TaskProject', TaskProject);

    function TaskProject () {

        // private variable
        

        var TaskProject = {
            _id: null
        };

        TaskProject.setId = function (id) {
            TaskProject._id = id;
        }

        TaskProject.getId = function () {
            return TaskProject._id;
        }

        return TaskProject;

    }

})();