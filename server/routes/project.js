var projectCtrl = require('./../controllers/project/index.js');

module.exports =  function(app, router) {
    'use strict';

    router
    .route('/projects')
    .post(projectCtrl.newProject)
    .get(projectCtrl.getProjects);

    router
    .route('/projects/:projectid')
    .get(projectCtrl.getProject);

};