var designCtrl = require('./../controllers/design/index.js');

module.exports =  function(app, router) {

    router
    .route('/designs/:designid')
    .get(designCtrl.getDesign);


    router
    .route('/designs/:designid/annotations')
    .post(designCtrl.newAnnotation);

};