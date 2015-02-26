(function(){

    angular.module('coapp')
    .controller('TasksController', TasksController);

    //sets up controller to handle task data

    function TasksController(TaskFactory, $stateParams, $scope, TaskProject){
        //set this, to avoid scope
        var _this = this;

        //array to hold all projects that the user has tasks in
        _this.allUserProjectsWithTasks = [];
        //array to hold all designs within the project
        _this.designsWithTasks = [];
        //array to hold all owner tasks
        _this.ownerTasks = [];
        //array to hold all user tasks
        _this.usersTasks = [];

        // listen for the annotation controller to complete a task
        $scope.$on('updatedTask', function (e) {
            _this.getTasks();
        });

        //boolean for sidebar, expand if false, hide if true
        _this.openSidebar = false;

        // used on the task page to see which project / design
        // is currently selected
        _this.currentTask = null;
        _this.hasActiveProject;
        _this.hasActiveDesign = false;
        _this.tasklistPage = false;
        _this.designId;

        //method called from task view to open and close the task sidebar
        _this.toggleTaskBar = function () {
            _this.openSidebar = !_this.openSidebar;
        };

        _this.isTaskPage = function () {
            return _this.tasklistPage;
        };

        //get tasks function calls the getTasks function from the factory
        /**
         * fetch the tasks from the db
         * @return {[type]} [description]
         */
        _this.getTasks = function(id){

            _this.hasActiveDesign = true;

            if (_this.currentTask === id) {
                return;
            }

            _this.tasklistPage = (id !== undefined);

            var _id = id || $stateParams.design_id;

            _this.designId = _id;
            //call getTasks from the taskService using a given id
            TaskFactory.getTasks(_id)
                .then(function(data){
                    if(data.length === 1) {
                        _this.ownerTasks = data;
                    } else {
                        _this.usersTasks = data;
                    }

                    if(_this.tasklistPage) {
                        _this.openSidebar = true;
                        _this.currentTask = _id;
                    }

                }, function(error){
                    _this.tasks = {};
                });
        };

        //get user projects that contain tasks
        //left panel on task view page
        _this.getUserProjectsWithTasks = function(){
            //call getUserProjectsWithTasks from taskService
            TaskFactory.getUserProjectsWithTasks()
                .then(function(data){
                    //set allUserProjectsWithTasks array with the data returned
                    _this.allUserProjectsWithTasks = data;
                }, function(error){
                    //if an error set to an empty object
                    _this.allUserProjectsWithTasks = {};
                });
        };


        //get designs with user tasks
        //center panel on task view page
        _this.getDesignsWithTasks = function(){

            // get the id of the selected project
            var id = TaskProject.getId();

            // reset default values
            _this.currentTask = null;
            _this.hasActiveDesign = false;
            _this.openSidebar = false;
            _this.hasActiveProject = true;
            //call getDesignsWithTasks from taskService
            TaskFactory.getDesignsWithTasks(id)
                .then(function(data){
                    //set designsWithTasks array to returned data
                    _this.designsWithTasks = data;
                }), function(error){
                    //if errors set to empty object
                    _this.designsWithTasks = {}
                };
        };

        //update a task, used if a task is completed
        _this.updateTask = function(task){

            // toggle the value of task
            task.isComplete = !task.isComplete;
            //call updteTask from service, passing in the task to update
            TaskFactory.updateTask(task)
                .then(function(data){
                    // successful updated
                }, function(error){
                    console.error(error);
                });
        };

        _this.init = function () {
            TaskProject.reset();
            this.getUserProjectsWithTasks();
            this.currentTask = null;
            this.hasActiveProject = false;
        };

        //used to higlight selected project
        _this.activeProject = function (id) {
            return id === TaskProject.getId();
        };

        //used to higlight selected design
        _this.activeDesign = function (id) {
            return id === _this.currentTask;
        }
    };


    TasksController.$inject = ["TaskFactory", "$stateParams", "$scope", "TaskProject"];

})();