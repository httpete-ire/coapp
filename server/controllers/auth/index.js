/**
 * @apiDefine InvalidData
 *
 * @apiError InvalidData The data provided was invalid
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Unproc­essable Entity
 *     {
 *       "fieldName": "Error for specific field"
 *     }
 *
 */

 /**
  * @apiDefine NotAuthorized
  *
  * @apiError NotAuthorized You must be proved valid authentication details
  *
  * @apiErrorExample Error-Response:
  *     HTTP/1.1 401 Unauthorized
  *     {
  *       "error": "You must be authenticated to perform this action"
  *     }
  *
  */

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
