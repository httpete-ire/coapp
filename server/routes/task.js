var taskCtrl = require('./../controllers/task');

module.exports =  function(app, router) {

    // create new design
    router
    .route('/designs/:designid/annotations/:annotationid/tasks/')
    .get(taskCtrl.read)
    .post(taskCtrl.create);

    router
    .route('/tasks/:taskid')
    .put(taskCtrl.update)
    .delete(taskCtrl.delete);


};