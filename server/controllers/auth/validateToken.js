'use strict';

var jwt = require('jwt-simple');

var tokenConfig = require('./../../config').token;

// middleware to validate a JWT
module.exports =  function (req, res, next) {

    if(req.headers.auth){
        // split the header by a space, the second item
        // in the array is the toker
        var token = req.headers.auth.split(' ')[1];

        // attempt to decode the token
        // if it fails it will throw an error so the catch block
        // is used to handle the error
        try {
            var decodedToken = jwt.decode(token, tokenConfig.secret);

            // set req.user to be the user
            req.user = decodedToken.user;

            // move onto the next middleware in the stack
            return next();
        } catch (err) {

            return res.send(401, 'you must be authenticated to perform this action');
        }

    } else {
        return res.send(401, 'you must be authenticated to perform this action');
    }
};