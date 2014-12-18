var User = require('./../../models/user.js');

var tokenHelper = require('./../../helpers/token.js');

var Validator = require('./../../helpers/validator.js');

'use strict';

/**
 * @api {post} /auth/login Login the user into the system
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {String} email Users email address
 * @apiParam {String} password Users password
 *
 * @apiSuccess {String} token JSON token
 * @apiSuccess {Number} user  id of the user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "token": "eyJ0eXAiOiJKV1QiLCJhbGci",   // example token
 *         "user": "548034cd65fb5600000a352f"
 *     }
 *
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No user found with that email"
 *     }
 *
 * @apiError InvalidData Invalid <code>email and/or password</code>
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Unproc­essable Entity
 *     {
 *       "error": "'Invalid email and/or password'"
 *     }
 */
function login (req, res, next) {

    var validator = new Validator();

    validator.addRule({
        field: 'email',
        value: req.body.email,
        rules: ['required', 'email']
    });

    validator.addRule({
        field: 'password',
        value: req.body.password,
        rules: ['required']
    });

    // if the validator fails return messages
    if (!validator.validate()) {
        return res.status(422).send(validator.getErrors());
    }

    // find user by email
    User.findOne({email: req.body.email}, function(err, user){

        // if a user does not exist return error
        if(!user){
            res.status(404).send('No user found with that email');
        }

        // compare users password to the password field
        user.comparePasswords(req.body.password, function(err, isMatch){

            // if passwords dont match return err
            if(!isMatch) {
                return res.status(422).send('Invalid email and/or password');
            }

            // generate a JWT token that contains the user object
            var token = tokenHelper.createToken(user);

            // return the token and the user id
            return res.json({
                token: token,
                user: user._id,
                username: user.username
            });
        });
    });
}

module.exports =  login;
