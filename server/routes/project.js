var projectCtrl = require('./../controllers/project/index.js');

module.exports =  function(app, router) {
    'use strict';

    router
    .route('/project')
    .post(projectCtrl.newProject)
    .get(projectCtrl.getProjects);

    router
    .route('/project/:projectid')
    .get(projectCtrl.getProject);

};