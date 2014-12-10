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
 * @apiParam (Query String) {String} [userid] user's id
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

    if (!validator.validate()) {
        return res.status(422).send(validator.getErrors());
    }

    // find user by email
    User.findOne({email: req.body.email}, function(err, user){

        console.log('working');

        // if user null return err
        if(!user){
            res.status(404).send('No user found with that email');
        }

        console.log('user is', user);

        user.comparePasswords(req.body.password, function(err, isMatch){

            // if passwords dont match return err
            if(!isMatch) {
                return res.status(422).send('Invalid email and/or password');
            }

            var token = tokenHelper.createToken(user);

            return res.json({
                token: token,
                user: user._id
            });
        });
    });
}

module.exports =  login;
