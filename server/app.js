'use strict';

var express = require('express');

// bootstrap app
var app = require('./helpers/appHelper')(express());

// set up routes
require('./routes')(app, express.Router());

var port = process.env.port || 3000;

// set the port for the app to listen on
app.listen(port);

console.log('app running on localhost:' + port);
