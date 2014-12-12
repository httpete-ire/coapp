var uploads = require('./../helpers/fileUpload.js');
var config = require('./../config');
var path = require('path');

module.exports = function (app, router) {

    router
    .route('/uploads')
    .get(require('./../controllers/upload').get)
    .post(require('./../controllers/upload').post);

};
