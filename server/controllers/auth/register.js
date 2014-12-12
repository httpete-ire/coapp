var User = require('./../../models/user.js');

var Validator = require('./../../helpers/validator.js');

'use strict';

/**
 * @api {post} /auth/register Register the user for the system
 *
 * @apiName Register
 * @apiGroup Auth
 *
 * @apiParam {String} email Users email address
 * @apiParam {String} username Users unique name
 * @apiParam {String} password Users password
 * @apiParam {String} confirmPassword Confirm password
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *
 * @apiError UserConflict The email is already taken
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": "'The email is already taken'"
 *     }
 *
 * @apiUse InvalidData
 *
 */
module.exports =  function login (req, res, next) {

    // validate data - username, email, password (comparePassword)
    var validator = new Validator();

    // validate all the form fields
    validator.addRule({
        field: 'username',
        value: req.body.username,
        rules: ['required']
    });

    validator.addRule({
        field: 'email',
        value: req.body.email,
        rules: ['required', 'email']
    });

    validator.addRule({
        field: 'password',
        value: req.body.password,
        rules: ['required', 'compare'],
        options: {
            compare: req.body.confirmPassword
        }
    });

    // if the validator fails return messages
    if (!validator.validate()) {
        return res.status(422).send(validator.getErrors());
    }

    // find a user by email or username
    User.findOne({
        $or: [
            {
                email: req.body.email
            }, {
                username: req.body.username
            }
        ]
    }, function (err, user) {

        // if user exists
        if(user) {

            // check if username is taken
            if (user.username === req.body.username) {
                res.status(409).send('the username' + req.body.username + ' is already taken');
            } else { // email is taken
                res.status(409).send('the email ' + req.body.email + ' is already taken');
            }

        } else {

            // create a new user
            var newUser = new User({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username
            });

            // save the new user
            newUser.save(function(err){

                if(err) {
                    return res.status(500).send(err);
                }

                return res.send(200);
            });
        }
    });
};
