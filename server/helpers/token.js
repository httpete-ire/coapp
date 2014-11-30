'use strict';

var jwt = require('jwt-simple');
var tokenConfig = require('./../config').token;

/**
 * generate an expiry date from curretn date plus numDays (ex 7 days)
 */
function expires (numDays) {

    // ensure number is a valid number, defaults to 0
    numDays = +numDays || 0;

    var date = new Date();

    return date.setDate(date.getDate() + numDays);
}

/**
 * generate the token with the user object and an expiration date
 * @param  {[type]} user [description]
 * @return {[type]}      [description]
 */
function createToken (user) {
    var payLoad = {
        user: user,
        iat: new Date().getTime(),
        ex: expires(tokenConfig.expires)
    };

    return jwt.encode(payLoad, tokenConfig.secret);
}

module.exports = {
    createToken: createToken
};
