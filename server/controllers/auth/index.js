'use strict';
/**
 * Facade class that contains methods for validating a token,
 * login and register
 */
module.exports = {
    validateToken: require('./validateToken'),
    login: require('./login'),
    register: require('./register')
};
