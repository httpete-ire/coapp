var User = require('./../../models/user.js');

var tokenHelper = require('./../../helpers/token.js');
/**
 * Find user by email and if found return a token
 *
 * @url :: /auth/login
 * @return {JSON} :: contains token and user
 */
function login (req, res, next) {

    'use strict';
    // find user by email
    User.findOne({email: req.body.email}, function(err, user){

        // if user null return err
        if(!user){
            return res.status(401).send('Cant find a user by  ' + req.body.email);
        }

        user.comparePasswords(req.body.password, function(err, isMatch){

            // if passwords dont match return err
            if(!isMatch) {
                return res.status(401).send('Invalid email and/or password');
            }

            var token = tokenHelper.createToken(user);

            console.log(user);

            return res.json({
                token: token,
                user: user._id
            });
        });
    });
}

module.exports =  login;
