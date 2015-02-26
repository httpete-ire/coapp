/**
 * middleware to send error messages to user
 *
 * @param  {Object}   err  :: error object
 * @param  {Object}   req  :: request object
 * @param  {Object}   res  :: response object
 * @param  {Function} next :: next middleware function
 *
 */
module.exports =  function (err, req, res, next) {

    req.unhandledError = err;

    var error = err.error || err;
    var status = err.status || 500;

    res.json({
        response: error
    }, status);
};