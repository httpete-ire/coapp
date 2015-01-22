var designCtrl = require('./../controllers/design/index.js');
var projectCtrl = require('./../controllers/project/index.js');
var annotationCtrl = require('./../controllers/annotation/index.js');
var commentCtrl = require('./../controllers/comment/index.js');



module.exports =  function(app, router) {

    // create new design
    router
    .route('/projects/:projectid/designs')
    .post(projectCtrl.middleware, designCtrl.create);

    // get design attributes
    router
    .route('/designs/:designid')
    .get(designCtrl.read)
    .delete(designCtrl.delete);

    // design specific annotations
    router
    .route('/designs/:designid/annotations')
    .post(annotationCtrl.create);

    router
    .route('/designs/:designid/annotations/:annotationid')
    .delete(annotationCtrl.delete);

    // annotation comments
    router
    .route('/designs/:designid/annotations/:annotationid/comments')
    .post(commentCtrl.create)
    .get(commentCtrl.read);

    // annotation comments
    router
    .route('/designs/:designid/annotations/:annotationid/comments/:commentid')
    .delete(commentCtrl.delete)
    .put(commentCtrl.update);

};