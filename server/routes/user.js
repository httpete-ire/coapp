var userCtrl = require('./../controllers/user/index.js');

module.exports =  function(app, router) {
    router
    .route('/users')
    .get(userCtrl.search);
};