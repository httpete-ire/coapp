var jwt = require('jwt-simple');
var tokenConfig = require('./../config').token;

/**
 * generate an expiry date from curretn date plus numDays (ex 7 days)
 */
function expires (numDays) {

    // ensure number is a valid number, defaults to 0
    numDays = +numDays || 0;

    var date = new Date();

    // return the new date
    return date.setDate(date.getDate() + numDays);
}

/**
 * generate the token with the user object and an expiration date
 * as the payload
 *
 * @param  {object} user
 *
 * @return {JWT} the encoded token
 */
function createToken (user, date) {
    var payLoad = {
        user: user,
        iat: new Date().getTime(),
        ex: expires( date|| tokenConfig.expires)
    };

    return jwt.encode(payLoad, tokenConfig.secret);
}

// export the function attached to the object
module.exports = {
    createToken: createToken
};
