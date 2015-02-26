var projectCtrl = require('./../controllers/project/index.js');

module.exports =  function(app, router) {

    // create and read projects
    router
    .route('/projects')
    .post(projectCtrl.create)
    .get(projectCtrl.getProjects);

    // delete, update and read single project
    router
    .route('/projects/:projectid')
    .get(projectCtrl.read)
    .delete(projectCtrl.delete)
    .put(projectCtrl.update);

};