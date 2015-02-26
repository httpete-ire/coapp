var userCtrl = require('./../controllers/user/index.js');

module.exports =  function(app, router) {

    // search for users
    router
    .route('/users')
    .get(userCtrl.search);
};