var User = require('./../../models/user.js');

/**
 * @api {post} /auth/register Register the user for the system
 *
 * @apiName Register
 * @apiGroup Auth
 *
 * @apiParam {String} email Users email address
 * @apiParam {String} password Users password
 */
module.exports =  function login (req, res, next) {

    'use strict';

    User.findOne({email: req.body.email}, function (err, user) {

        if(user) {
            res.status(409).send(req.body.email + ' is already taken');
        } else {
            var newUser = new User({
                email: req.body.email,
                password: req.body.password
            });

            newUser.save(function(err){
                if(err) {
                    return res.send(err);
                }

                console.log(newUser);

                return res.send(200);
            });
        }
    });
};
