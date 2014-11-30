'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./../config');

var express = require('express');

var fileUpload  = require('./fileUpload.js');

var config = require('./../config');

/**
 * Sets middleware and properties for the app
 * @param  {object} app - app object to attach middleware to
 * @return app
 */
module.exports =  function(app) {

    // create uploads directory if needed
    fileUpload.checkExists([__dirname + config.upload.uploadsDir, __dirname + config.upload.tmpDir]);
    // set path of HTML,CSS,JS
    app.use(express.static(__dirname + config.publicDir));

    // setup logging
    app.use(morgan('dev'));

    // connect to DB
    mongoose.connect(config.db);

    // setup up body parse so form inputs can be read
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse

    // redirect every query that isnt to the API to render the angular app
    app.get('/', function(req, res){
        res.sendfile('public/index.html');
    });

    return app;
};