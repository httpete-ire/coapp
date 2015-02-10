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

    // specific tasks
    router
    .route('/tasks/:taskid')
    .put(taskCtrl.update);

    router
    .route('/tasks')
    .get(taskCtrl.readUserTasks);

    // .delete(taskCtrl.delete);

};