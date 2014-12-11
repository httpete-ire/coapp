'use strict';

var jwt = require('jwt-simple');

var tokenConfig = require('./../../config').token;


module.exports =  function (req, res, next) {

    if(req.headers.auth){
        var token = req.headers.auth.split(' ')[1];

        try {
            var decodedToken = jwt.decode(token, tokenConfig.secret);

            // set req.user to be the user
            req.user = decodedToken.user;

            return next();

        } catch (err) {
            return res.send(401, 'you must be authenticated to perform this action');
        }

    } else {
        return res.send(401, 'you must be authenticated to perform this action');
    }

    // continue to next middleware
    next();
};