var projectCtrl = require('./../controllers/project/index.js');

module.exports =  function(app, router) {

    router
    .route('/projects')
    .post(projectCtrl.newProject)
    .get(projectCtrl.getProjects);

    router
    .route('/projects/:projectid')
    .get(projectCtrl.getProject)
    .delete(projectCtrl.removeProject);
    // update project {PUT}

};