var taskCtrl = require('./../controllers/task');

module.exports =  function(app, router) {

    // create a task for a design
    router
    .route('/designs/:designid/annotations/:annotationid/tasks/')
    .post(taskCtrl.create);

    // read tasks from a design
    router
    .route('/designs/:designid/tasks')
    .get(taskCtrl.read);;

    // update a specific task
    router
    .route('/tasks/:taskid')
    .put(taskCtrl.update);

    // read all the tasks from the user
    router
    .route('/tasks')
    .get(taskCtrl.readUserTasks);

    // get tasks assigned to a project
    router
    .route('/tasks/projects')
    .get(taskCtrl.projectWithTasks);

    // get tasks from a design
    router
    .route('/tasks/projects/:projectid')
    .get(taskCtrl.designWithTasks);

};