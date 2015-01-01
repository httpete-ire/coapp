var projectCtrl = require('./../controllers/project/index.js');

module.exports =  function(app, router) {

    router
    .route('/projects')
    .post(projectCtrl.create)
    .get(projectCtrl.getProjects);

    router
    .route('/projects/:projectid')
    .get(projectCtrl.read)
    .delete(projectCtrl.delete)
    .put(projectCtrl.update);

};