var authCtrl = require('./../controllers/auth');

module.exports =  function (app, router) {

    // auth routes
    app
    .post('/auth/login', authCtrl.login)
    .post('/auth/register', authCtrl.register);

    return app;
};