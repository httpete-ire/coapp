var designCtrl = require('./../controllers/design/index.js');

module.exports =  function(app, router) {

    router
    .route('/design/:projectid')
    .post(designCtrl.newDesign);

};